import json
import os
import hashlib
import secrets
import psycopg2


SCHEMA = 't_p14134602_wedding_invite_site_'
T = SCHEMA + '.site_content'

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
    'Access-Control-Max-Age': '86400',
}
JSON_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
}


def get_user_password():
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute("SELECT value FROM " + T + " WHERE key = 'user_password'")
        row = cur.fetchone()
        cur.close()
        conn.close()
        return row[0] if row else ''
    except Exception:
        return ''


def make_token(secret: str, role: str) -> str:
    salt = secrets.token_hex(8)
    payload = f"{secret}:{role}:{salt}"
    token_hash = hashlib.sha256(payload.encode()).hexdigest()
    return f"{token_hash}.{role}"


def parse_role(token: str) -> str:
    """Возвращает роль из токена: 'admin' или 'user', либо '' если некорректный"""
    if '.' not in token:
        return ''
    parts = token.rsplit('.', 1)
    return parts[1] if parts[1] in ('admin', 'user') else ''


def handler(event, context):
    """Авторизация: поддерживает роли admin и user. Возвращает токен с закодированной ролью."""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    if event.get('httpMethod') == 'POST':
        body = json.loads(event.get('body', '{}'))
        login = body.get('login', '')
        password = body.get('password', '')

        admin_login = os.environ.get('ADMIN_LOGIN', 'admin')
        admin_password = os.environ.get('ADMIN_PASSWORD', '')

        if not admin_password:
            return {
                'statusCode': 500,
                'headers': JSON_HEADERS,
                'body': json.dumps({'error': 'Пароль не настроен'}),
            }

        if login == admin_login and password == admin_password:
            token = make_token(admin_password, 'admin')
            return {
                'statusCode': 200,
                'headers': JSON_HEADERS,
                'body': json.dumps({'success': True, 'token': token, 'role': 'admin'}),
            }

        user_login = 'user'
        user_password = get_user_password()
        if user_password and login == user_login and password == user_password:
            token = make_token(user_password, 'user')
            return {
                'statusCode': 200,
                'headers': JSON_HEADERS,
                'body': json.dumps({'success': True, 'token': token, 'role': 'user'}),
            }

        return {
            'statusCode': 401,
            'headers': JSON_HEADERS,
            'body': json.dumps({'error': 'Неверный логин или пароль'}),
        }

    if event.get('httpMethod') == 'GET':
        token = (event.get('headers') or {}).get('X-Admin-Token', '')
        if not token:
            params = event.get('queryStringParameters') or {}
            token = params.get('token', '')

        if not token:
            return {
                'statusCode': 401,
                'headers': JSON_HEADERS,
                'body': json.dumps({'valid': False, 'role': ''}),
            }

        role = parse_role(token)
        return {
            'statusCode': 200,
            'headers': JSON_HEADERS,
            'body': json.dumps({'valid': bool(role), 'role': role}),
        }

    return {
        'statusCode': 405,
        'headers': JSON_HEADERS,
        'body': json.dumps({'error': 'Method not allowed'}),
    }
