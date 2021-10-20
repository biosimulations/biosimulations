def handler():
    """ Get information about the status of the service

    Returns:
        :obj:`dict` in ``Health`` schema
    """
    return {
        "status": "ok"
    }
