import connexion
# Swagger ui is at /ui path
app = connexion.App(__name__, specification_dir='spec/')
app.add_api('combine-service.yml',  validate_responses=True)
# Validate_response = True will give error when API returns something that does not match the schema.
# If you want to send a response even if invalid, set to false.
# Set to false in production if optimistic that client can handle the response better than getting error

if __name__ == '__main__':
    # DEV Server only
    app.run(host="127.0.0.1", port=3333, threaded=True, debug=True)
