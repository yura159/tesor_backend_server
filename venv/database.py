from ast import literal_eval


class db:
    @staticmethod
    def get_news():
        with open("news.txt", 'r', encoding="UTF-8") as news_file:
            data = literal_eval(f"{news_file.read()}]")
        return data

    @staticmethod
    def add_news(json_new):
        with open('news.txt', 'a', encoding='UTF-8') as news_file:
            news_file.write(f"{json_new},")

    @staticmethod
    def user_exists(email, password):
        with open('users.txt', 'r', encoding='UTF-8') as users_file:
            users = literal_eval(f"{users_file.read()}")
        return users[email] == password