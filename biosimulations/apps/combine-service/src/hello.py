class HelloFactory:
    def __init__(self, **args):
        for key, value in args.items():
            setattr(self, key, 'Hello {}'.format(value))


if __name__ == '__main__':
    hello = HelloFactory(application="combine-service", user="Human")
    print(hello.application)
