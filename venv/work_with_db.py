import pymysql

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
        return query.fetchall()

    def add_news(self, date, news):
        query = self.con.cursor()
        query.execute(f"INSERT INTO {self.news} VALUES ('{date}', '{news}');")
        self.con.commit()

    def user_exists(self, email, password):
        query = self.con.cursor()
        query.execute(f"select password from {self.admins} where email = '{email}'")
        return query.fetchall()[0][0] == password