import json

from work_with_db import database
from aiohttp import web
from datetime import datetime

routes = web.RouteTableDef()
db = database()


@routes.post('/api/report')
async def create_report(request):
    data = await request.post()
    with open("report.txt", 'w', encoding='UTF-8') as report:
        report.write(f"Отчет за период {data['start']}:{data['end']}")
    return web.Response(text=json.dumps({}), status=200)


@routes.post('/api/login')
async def login(request):
    data = await request.post()
    if not await db.user_exists(data['email'], data['password']):
        return web.Response(text=json.dumps({}), status=401)
    return web.Response(text=json.dumps({"auth": "some_auth_key"}), status=200)


@routes.post('/api/news')
async def post_news(request):
    data = await request.post()
    date = datetime.now().date()
    json_new = json.dumps({
        "text": data["text"],
        "time": f"{date.day}.{date.month}.{date.year}"})
    await db.add_news(date, data['text'])
    return web.Response(text=json_new, status=200)


@routes.post('/api/quiz')
async def update_quiz(request):
    quiz = await request.post()
    await db.pull_json(quiz['data'])
    return web.Response(text=json.dumps({}), status=200)


@routes.get('/api/news')
async def get_news_list(request):
    result = []
    for news in await db.get_news():
        dict_news = {'text': news[1], 'time': f"{news[0].day}.{news[0].month}.{news[0].year}"}
        result.append(dict_news)
    return web.Response(text=json.dumps({
        "news": result
    }), status=200)


@routes.get('/api/quiz')
async def get_quiz(request):
    data = await db.get_quiz()
    return web.Response(text=data, status=200)


@routes.get('/api/report')
async def get_report(request):
    with open('report.txt', 'r', encoding='UTF-8') as report:
        data = report.read()
    return web.Response(text=json.dumps({
        "report": data
    }), status=200)

app = web.Application()
app.add_routes(routes)
web.run_app(app)
