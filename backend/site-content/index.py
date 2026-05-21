import json
import os
import psycopg2

SCHEMA = 't_p14134602_wedding_invite_site_'
T = SCHEMA + '.site_content'

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    'Access-Control-Max-Age': '86400',
}
JSON_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
}


def handler(event, context):
    """Управление контентом главной страницы: чтение и обновление через админку"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
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

    if method == 'PUT':
        token = (event.get('headers') or {}).get('X-Admin-Token', '')
        if not token:
            cur.close()
            conn.close()
            return {
                'statusCode': 401,
                'headers': JSON_HEADERS,
                'body': json.dumps({'error': 'Не авторизован'})
            }

        body = json.loads(event.get('body', '{}'))
        updates = body.get('updates', {})

        if not updates:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': JSON_HEADERS,
                'body': json.dumps({'error': 'Нет данных для обновления'})
            }

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

    cur.close()
    conn.close()
    return {
        'statusCode': 405,
        'headers': JSON_HEADERS,
        'body': json.dumps({'error': 'Method not allowed'})
    }
