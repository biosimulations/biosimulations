import connexion
import flask
import werkzeug


class BadRequestException(connexion.ProblemException, werkzeug.exceptions.BadRequest):
    ''' A bad request

    Attributes:
        title (:obj:`str`): title
        instance (:obj:`Exception`): exception
        validation_report (``ValidationReport``): validation report
        status (:obj:`int`): status code
    '''

    def __init__(self, title, instance, validation_report=None, status=400):
        """
        Args:
            title (:obj:`str`): title
            instance (:obj:`Exception`): exception
            validation_report (``ValidationReport``, optional): validation report
            status (:obj:`int`, optional): status code
        """
        super(BadRequestException, self).__init__(title=title, instance=instance, status=status)
        self.validation_report = validation_report

    def get_response(self):
        """ Get repsonse

        Returns:
            :obj:`werkzeug.wrappers.response.Response`: response
        """
        data = {
            'status': self.status,
            'title': self.title,
            'detail': str(self.instance),
            'type': str(self.instance.__class__.__name__),
        }
        if self.validation_report is not None:
            data['validationReport'] = self.validation_report
        return flask.jsonify(data), self.status


def _render_exception(exception):
    """ Render an exception

    Args:
        exception (:obj:`Exception`): exception

    Returns:
        :obj:`werkzeug.wrappers.response.Response`: response
    """
    if isinstance(exception, BadRequestException):
        return exception.get_response()
    else:
        data = {
            'status': 500,
            'title': 'Server error',
            'detail': str(exception),
            'type': exception.__class__.__name__,
        }
        return flask.jsonify(data), 500
