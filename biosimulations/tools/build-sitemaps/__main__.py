#!/usr/bin/env python3

import argparse
import datetime
import dateutil.parser
import enum
import jinja2
import os
import requests
import sys


class ChangeFreq(str, enum.Enum):
    always = 'always'
    hourly = 'hourly'
    daily = 'daily'
    weekly = 'weekly'
    monthly = 'monthly'
    yearly = 'yearly'
    never = 'never'


class Url(object):
    """ A URL (route) in a sitemap

    Attributes:
        loc (:obj:`str`): path relative to the base URL of the application
        last_mod (:obj:`datetime.date`): date that the route was last modified
        change_freq (:obj:`ChangeFreq`): estimate of how frequently the route will be updated
    """

    def __init__(self, loc, last_mod, change_freq):
        """
        Args:
            loc (:obj:`str`): path relative to the base URL of the application
            last_mod (:obj:`datetime.date`): date that the route was last modified
            change_freq (:obj:`ChangeFreq`): estimate of how frequently the route will be updated
        """
        self.loc = loc
        self.last_mod = last_mod
        self.change_freq = change_freq


def get_common_static_urls():
    help_route = [Url(
        loc="",
        last_mod=datetime.datetime(2020, 12, 23),
        change_freq=ChangeFreq.weekly
    ),

        Url(
        loc="help",
        last_mod=datetime.datetime(2020, 12, 23),
        change_freq=ChangeFreq.monthly
    ),
        Url(
        loc="help/faq",
        last_mod=datetime.datetime(2020, 12, 23),
        change_freq=ChangeFreq.monthly
    ),
        Url(
        loc="help/about",
        last_mod=datetime.datetime(2020, 12, 23),
        change_freq=ChangeFreq.monthly
    ),
        Url(
        loc="help/terms",
        last_mod=datetime.datetime(2020, 12, 23),
        change_freq=ChangeFreq.monthly
    ),
        Url(
        loc="help/privacy",
        last_mod=datetime.datetime(2020, 12, 23),
        change_freq=ChangeFreq.monthly
    ),
    ]

    return help_route


def get_biosimulations_static_urls():
    landings = [Url(loc="models",
                    last_mod=datetime.datetime(2020, 12, 23),
                    change_freq=ChangeFreq.monthly)]
    return get_common_static_urls() + landings


def get_runbiosimulations_static_urls():
    simulators = [
        Url(loc="run",
            last_mod=datetime.datetime(2020, 12, 23),
            change_freq=ChangeFreq.monthly
            ),
        Url(loc="simulations",
            last_mod=datetime.datetime(2020, 12, 23),
            change_freq=ChangeFreq.monthly
            )
    ]
    return get_common_static_urls() + simulators


def get_simulator_static_urls():
    help_route = get_common_static_urls()
    standards = [Url(
        loc="standards",
        last_mod=datetime.datetime(2020, 12, 23),
        change_freq=ChangeFreq.monthly
    ),
        Url(
        loc="standards/simulator-specs",
        last_mod=datetime.datetime(2020, 12, 23),
        change_freq=ChangeFreq.monthly
    ),
        Url(
        loc="standards/simulator-interfaces",
        last_mod=datetime.datetime(2020, 12, 23),
        change_freq=ChangeFreq.monthly
    ),
        Url(
        loc="standards/simulator-images",
        last_mod=datetime.datetime(2020, 12, 23),
        change_freq=ChangeFreq.monthly
    ),
        Url(
        loc="standards/simulation-experiments",
        last_mod=datetime.datetime(2020, 12, 23),
        change_freq=ChangeFreq.monthly
    ),
        Url(
        loc="standards/simulations-reports",
        last_mod=datetime.datetime(2020, 12, 23),
        change_freq=ChangeFreq.monthly
    )
    ]

    return help_route+standards


def render_url_list(app_name, urls):
    """ Render sitemap to url list for use in prerendering 
    Args:
        app_name (:obj:`str`): application name (e.g., `simulators`
        urls (:obj:`list` of obj:`Url`): list of URLs

    """

    # render sitemap to text file
    with open(os.path.join(os.path.dirname(__file__), '..', '..', 'apps', app_name, 'routes.txt'), 'w') as file:
        for url in urls:
            file.write("/")
            file.write(url.loc)
            file.write("\n")


def render_sitemap(app_name, base_url, urls):
    """ Render sitemap to XML file

    Args:
        app_name (:obj:`str`): application name (e.g., `simulators`)
        base_url (:obj:`str`): base URL for the application (e.g., `https://biosimulators.org/`)
        urls (:obj:`list` of obj:`Url`): list of URLs
    """

    # read sitemap template
    with open(os.path.join(os.path.dirname(__file__), 'sitemap.template.xml'), 'r') as file:
        template = jinja2.Template(file.read())

    # render sitemap to XML file
    with open(os.path.join(os.path.dirname(__file__), '..', '..', 'apps', app_name, 'src', 'sitemap.xml'), 'w') as file:
        file.write(template.render(base_url=base_url, urls=urls))


def build_biosimulators_sitemap():
    urls = []
    response = requests.get('https://api.biosimulators.org/simulators')
    response.raise_for_status()
    simulators = response.json()
    simulatorLatestVersions = {}
    for simulator in simulators:
        urls.append(Url(
            loc='simulators' + '/' +
                simulator['id'] + '/' + simulator['version'],
            last_mod=dateutil.parser.parse(
                simulator['biosimulators']['updated']).date(),
            change_freq=ChangeFreq.monthly),
        )

        if (simulator['id'] not in simulatorLatestVersions) or (simulator['version'] > simulatorLatestVersions[simulator['id']]['version']):
            simulatorLatestVersions[simulator['id']] = {
                'version': simulator['version'],
                'last_mod': dateutil.parser.parse(simulator['biosimulators']['updated']).date(),
            }

    for id, val in simulatorLatestVersions.items():
        urls.append(Url(
            loc='simulators' + '/' + id,
            last_mod=val['last_mod'],
            change_freq=ChangeFreq.monthly),
        )
    urls = urls + get_simulator_static_urls()

    urls.sort(key=lambda url: (url.loc))

    render_sitemap('simulators', 'https://biosimulators.org/', urls)
    render_url_list('simulators', urls)


def build_runbiosimulations_sitemap():
    urls = []
    urls = urls + get_runbiosimulations_static_urls()
    render_sitemap('dispatch', 'https://run.biosimulators.org/', urls)
    render_url_list('dispatch', urls)


def build_biosimulations_sitemap():
    urls = []
    urls = urls + get_biosimulations_static_urls()
    render_sitemap('platform', 'https://biosimulations.org/', urls)
    render_url_list('platform', urls)


def main(apps=None, verbose=False):
    """ 
    Args:
        main (:obj:`list` of :obj:`str`, optional): list of the ids of apps to build sitemaps for;
            default: build sitemaps for all apps
        verbose (:obj:`bool`, optional): if :obj:`True`, print debugging information
    """

    apps = set(apps) or set([])

    undefined_apps = set(apps).difference(
        set(['simulators', 'dispatch', 'platform']))
    if undefined_apps:
        raise ValueError('The following apps are not defined: {}'.format(
            ", ".join("'{}'".format(app) for app in sorted(undefined_apps))))

    if not apps or 'simulators' in apps:
        if verbose:
            print('Building sitemap for simulators app ...')
        build_biosimulators_sitemap()

    if not apps or 'dispatch' in apps:
        if verbose:
            print('Building sitemap for dispatch app ...')
        build_runbiosimulations_sitemap()

    if not apps or 'platform' in apps:
        if verbose:
            print('Building sitemap for platform app ...')
        build_biosimulations_sitemap()

    if verbose:
        print('done.')


if __name__ == '__main__':
    """ Command-line arguments

    * None: build sitemaps for all apps
    * List of arguments which are the ids of apps: build sitemaps for the specified apps
    * Single argument with a comma-separated list of ids of apps: build sitemaps for the specified apps
    """
    parser = argparse.ArgumentParser(
        description='Build sitemaps for one or more apps')
    parser.add_argument('apps', type=str, nargs='*',
                        help='App id (e.g., simulators)')
    parser.add_argument('-v', '--verbose', action='store_true',
                        help='Display debugging information')
    args = parser.parse_args()

    apps = []
    for arg in args.apps:
        apps.extend(app.strip() for app in arg.split(','))
    apps = list(filter(lambda app: app, apps))

    try:
        main(apps=apps, verbose=args.verbose)
    except Exception as error:
        raise SystemExit(str(error))
