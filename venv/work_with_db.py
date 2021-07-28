import pymysql
import json

from ast import literal_eval


class database:
    def __init__(self):
        with open('database_data', 'r', encoding='UTF-8') as data_dile:
            data = literal_eval(data_dile.read())
        self.news = data['news_table']
        self.admins = data['admins_table']
        try:
            self.con = pymysql.connect(host=data['host'],
                                       user=data['user'],
                                       password=data['password'],
                                       db=data['db_name'])
        except:
            print('error')


    def get_news(self):
        query = self.con.cursor()
        query.execute(f"select * from {self.news}")
        self.con.commit()
        return query.fetchall()

    def get_quiz(self):
        with open('my_quiz', 'r', encoding='UTF-8') as quiz:
            x = quiz.read() 
            result = json.dumps(literal_eval(x))
        return result

    def add_news(self, date, news):
        query = self.con.cursor()
        query.execute(f"INSERT INTO {self.news} (date_news, news) VALUES ('{date}', '{news}');")
        self.con.commit()

    def user_exists(self, email, password):
        query = self.con.cursor()
        query.execute(f"select password from {self.admins} where email = '{email}'")
        self.con.commit()
        return query.fetchall()[0][0] == password

    def pull_json(self, json_data: str):
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
