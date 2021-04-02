import connexion

app = connexion.App(__name__, specification_dir='spec/')
app.add_api('combine-service.yml')
app.run(port=3333)