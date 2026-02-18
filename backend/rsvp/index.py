import json
import os
import psycopg2

def handler(event, context):
    """Сохранение и получение RSVP-ответов гостей свадьбы"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    method = event.get('httpMethod', 'GET')

    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        first_name = body.get('first_name', '').strip()
        last_name = body.get('last_name', '').strip()
        guests_count = body.get('guests_count', 1)
        wishes = body.get('wishes', '').strip()
        has_plus_one = body.get('has_plus_one', False)
        plus_one_name = body.get('plus_one_name', '').strip()
        allergies = body.get('allergies', '').strip()
        drink_preference = body.get('drink_preference', '').strip()
        need_transfer = body.get('need_transfer', False)

        if not first_name or not last_name:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Имя и фамилия обязательны'})
            }

        esc = lambda s: s.replace("'", "''")
        cur.execute(
            "INSERT INTO rsvp (first_name, last_name, guests_count, wishes, has_plus_one, plus_one_name, allergies, drink_preference, need_transfer) "
            "VALUES ('%s', '%s', %d, '%s', %s, '%s', '%s', '%s', %s) RETURNING id"
            % (
                esc(first_name), esc(last_name), int(guests_count), esc(wishes),
                'TRUE' if has_plus_one else 'FALSE',
                esc(plus_one_name), esc(allergies), esc(drink_preference),
                'TRUE' if need_transfer else 'FALSE'
            )
        )
        row_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'success': True, 'id': row_id})
        }

    cur.execute(
        "SELECT id, first_name, last_name, guests_count, wishes, created_at::text, "
        "has_plus_one, plus_one_name, allergies, drink_preference, need_transfer "
        "FROM rsvp ORDER BY created_at DESC"
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    guests = [
        {
            'id': r[0],
            'first_name': r[1],
            'last_name': r[2],
            'guests_count': r[3],
            'wishes': r[4],
            'created_at': r[5],
            'has_plus_one': r[6],
            'plus_one_name': r[7],
            'allergies': r[8],
            'drink_preference': r[9],
            'need_transfer': r[10]
        }
        for r in rows
    ]

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'guests': guests, 'total': len(guests)})
    }
