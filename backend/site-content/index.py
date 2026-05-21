import base64
import json
import os
import uuid
import psycopg2
import boto3

SCHEMA = 't_p14134602_wedding_invite_site_'
T = SCHEMA + '.site_content'

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    'Access-Control-Max-Age': '86400',
}
JSON_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
}

CONTENT_TYPES = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'mov': 'video/quicktime',
    'mp4': 'video/mp4',
}


def handler(event, context):
    """Управление контентом главной страницы: чтение, обновление и загрузка медиафайлов"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute("SELECT key, value FROM " + T)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        content = {r[0]: r[1] for r in rows}
        return {
            'statusCode': 200,
            'headers': JSON_HEADERS,
            'body': json.dumps({'content': content})
        }

    if method == 'POST':
        token = (event.get('headers') or {}).get('X-Admin-Token', '')
        if not token:
            return {
                'statusCode': 401,
                'headers': JSON_HEADERS,
                'body': json.dumps({'error': 'Не авторизован'})
            }

        body = json.loads(event.get('body', '{}'))
        file_data = body.get('file')
        filename = body.get('filename', 'upload.jpg')

        if not file_data:
            return {
                'statusCode': 400,
                'headers': JSON_HEADERS,
                'body': json.dumps({'error': 'Нет файла'})
            }

        ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else 'jpg'
        content_type = CONTENT_TYPES.get(ext, 'application/octet-stream')
        key = 'wedding/' + str(uuid.uuid4()) + '.' + ext

        file_bytes = base64.b64decode(file_data)

        s3 = boto3.client(
            's3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        )
        s3.put_object(Bucket='files', Key=key, Body=file_bytes, ContentType=content_type)

        cdn_url = 'https://cdn.poehali.dev/projects/{}/bucket/{}'.format(
            os.environ['AWS_ACCESS_KEY_ID'], key
        )

        return {
            'statusCode': 200,
            'headers': JSON_HEADERS,
            'body': json.dumps({'url': cdn_url})
        }

    if method == 'PUT':
        token = (event.get('headers') or {}).get('X-Admin-Token', '')
        if not token:
            return {
                'statusCode': 401,
                'headers': JSON_HEADERS,
                'body': json.dumps({'error': 'Не авторизован'})
            }

        body = json.loads(event.get('body', '{}'))
        updates = body.get('updates', {})

        if not updates:
            return {
                'statusCode': 400,
                'headers': JSON_HEADERS,
                'body': json.dumps({'error': 'Нет данных для обновления'})
            }

        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        esc = lambda s: str(s).replace("'", "''")
        for key, value in updates.items():
            cur.execute(
                "INSERT INTO " + T + " (key, value, updated_at) VALUES ('%s', '%s', NOW()) "
                "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()"
                % (esc(key), esc(value))
            )
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': JSON_HEADERS,
            'body': json.dumps({'success': True})
        }

    return {
        'statusCode': 405,
        'headers': JSON_HEADERS,
        'body': json.dumps({'error': 'Method not allowed'})
    }
