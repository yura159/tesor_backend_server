import json

from database import db
from aiohttp import web
from datetime import datetime

routes = web.RouteTableDef()


@routes.post('/api/login')
async def login(request):
    data = await request.post()
    if not db.user_exists(data['email'], data['password']):
        return web.Response(text=json.dumps({}), status=401)
    return web.Response(text=json.dumps({"auth": "some_auth_key"}), status=200)


@routes.post('/api/news')
async def post_news(request):
    data = await request.post()
    date = datetime.now().date()
    json_new = json.dumps({
        "text": data["text"],
        "time": f"{date.day}.{date.month}.{date.year}"})
    db.add_news(json_new)
    return web.Response(text=json_new, status=200)


@routes.get('/api/news')
async def get_news_list(request):
    news = db.get_news()
    return web.Response(text=json.dumps({
        "news": news
    }), status=200)


app = web.Application()
app.add_routes(routes)
web.run_app(app)
