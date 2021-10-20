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


def get_root_static_urls():
    return [
        Url(
            loc="",
            last_mod=datetime.datetime(2020, 12, 23),
            change_freq=ChangeFreq.weekly
        ),
    ]


def get_help_static_urls():
    return [
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


def get_biosimulations_static_urls():
    return (
        get_root_static_urls()
        + [
            Url(
                loc="projects",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly,
            ),
        ]
    )


def get_runbiosimulations_static_urls():
    return (
        get_root_static_urls()
        + get_help_static_urls()
        + [
            Url(
                loc="create",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="run",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="simulations",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="utils/convert",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="utils/validate-model",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="utils/validate-simulation",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="utils/validate-metadata",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="utils/validate-project",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="utils/suggest-simulator",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
        ]
    )


def get_simulator_static_urls():
    return (
        get_root_static_urls()
        + get_help_static_urls()
        + [
            Url(
                loc="conventions",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="conventions/simulator-specs",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="conventions/simulator-interfaces",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="conventions/simulator-images",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="conventions/simulation-experiments",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="conventions/simulation-reports",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="conventions/data-viz",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="conventions/metadata",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
            Url(
                loc="conventions/simulation-logs",
                last_mod=datetime.datetime(2020, 12, 23),
                change_freq=ChangeFreq.monthly
            ),
        ]
    )


def render_url_list(app_name, urls):
    """ Render sitemap to URL list for use in prerendering 

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
    urls = get_simulator_static_urls()

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
            change_freq=ChangeFreq.monthly,
        ))

    urls.sort(key=lambda url: (url.loc))

    render_sitemap('simulators', 'https://biosimulators.org/', urls)
    render_url_list('simulators', urls)


def build_runbiosimulations_sitemap():
    urls = get_runbiosimulations_static_urls()
    urls.sort(key=lambda url: (url.loc))
    render_sitemap('dispatch', 'https://run.biosimulators.org/', urls)
    render_url_list('dispatch', urls)


def build_biosimulations_sitemap():
    urls = get_biosimulations_static_urls()

    response = requests.get('https://api.biosimulations.org/projects')
    response.raise_for_status()
    projects = response.json()
    for project in projects:
        urls.append(Url(
            loc='projects' + '/' + project['id'],
            last_mod=dateutil.parser.parse(project['updated']).date(),
            change_freq=ChangeFreq.monthly,
        ))

    urls.sort(key=lambda url: (url.loc))
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
