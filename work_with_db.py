import pymysql
import json

from ast import literal_eval


class database:
    def __init__(self):
        with open('database_data', 'r', encoding='UTF-8') as data_dile:
            data = literal_eval(data_dile.read())
        self.__news = data['news_table']
        self.__admins = data['admins_table']
        self.__que_table = 'questions'
        self.__links_table = 'links'
        try:
            self.con = pymysql.connect(host=data['host'],
                                       user=data['user'],
                                       password=data['password'],
                                       db=data['db_name'])
        except:
            print('error')

    async def get_news(self):
        query = self.con.cursor()
        query.execute(f"select * from {self.__news}")
        self.con.commit()
        return query.fetchall()

    async def get_quiz(self):
        pages = []
        query = self.con.cursor()
        query.execute(f'SELECT * FROM botdb.{self.__que_table}')

        questions = query.fetchall()

        for question in questions:
            query.execute(f'SELECT * FROM {self.__links_table} WHERE links.id = {question[1]}')
            buttons = query.fetchall()
            answers = []
            for button in buttons:
                answers.append({'text': button[2],
                                'link': button[1]})

            pages.append({'page_id': question[1],
                          'type': question[2],
                          'text': question[0],
                          'error': question[3],
                          'answer_type': question[4],
                          'answer': answers})

            if question[3] is None:
                del pages[-1]['error']

        questions = json.dumps({'pages': pages}, ensure_ascii=False)
        self.con.commit()
        return questions

    async def add_news(self, date, news):
        query = self.con.cursor()
        query.execute(f"INSERT INTO {self.__news} (date_news, news) VALUES ('{date}', '{news}');")
        self.con.commit()

    async def user_exists(self, email, password):
        query = self.con.cursor()
        query.execute(f"select password from {self.__admins} where email = '{email}'")
        self.con.commit()
        return query.fetchall()[0][0] == password

    async def pull_json(self, json_data: str):
        query = self.con.cursor()
        data = json.loads(json_data)['pages']  # Парсим json
        query.execute(f"DELETE FROM links")
        query.execute(f"DELETE FROM questions")
        self.con.commit()
        query = self.con.cursor()
        for page in data:
            columns = ["text", "page_id", "type", "error", "answer_type"]
            active_columns = [col for col in columns if col in page]
            fields = ", ".join([f"'{page[field]}'" for field in active_columns])
            cols = ", ".join([f"{field}" for field in active_columns])
            query.execute(f"INSERT INTO questions ({cols}) VALUES ({fields});")
            for answer in page['answer']:
                columns = ["link", "text"]
                active_columns = [col for col in columns if col in answer]
                fields = ", ".join([f"'{answer[field]}'" for field in active_columns])
                cols = ", ".join([f"{field}" for field in active_columns])
                fields_ = f"INSERT INTO links (id, {cols}) VALUES" \
                          f" ('{page['page_id']}', {fields});"
                query.execute(
                    fields_)
        self.con.commit()
