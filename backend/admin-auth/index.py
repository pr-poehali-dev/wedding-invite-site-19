import json
import os
import hashlib
import secrets


def handler(event, context):
    """Авторизация администратора — проверяет логин и пароль для доступа в админку"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Token',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }

    if event.get('httpMethod') == 'POST':
        body = json.loads(event.get('body', '{}'))
        login = body.get('login', '')
        password = body.get('password', '')

        admin_login = os.environ.get('ADMIN_LOGIN', 'admin')
        admin_password = os.environ.get('ADMIN_PASSWORD', '')

        if not admin_password:
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': 'Пароль не настроен'}),
            }

        if login == admin_login and password == admin_password:
            token = hashlib.sha256(
                f"{admin_password}:{secrets.token_hex(8)}".encode()
            ).hexdigest()

            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True, 'token': token}),
            }

        return {
            'statusCode': 401,
            'headers': headers,
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
                'headers': headers,
                'body': json.dumps({'valid': False}),
            }

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'valid': True}),
        }

    return {
        'statusCode': 405,
        'headers': headers,
        'body': json.dumps({'error': 'Method not allowed'}),
    }
