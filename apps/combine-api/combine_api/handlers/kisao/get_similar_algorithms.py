from combine_api.exceptions import BadRequestException
from kisao import Kisao
from kisao.data_model import ALGORITHM_SUBSTITUTION_POLICY_LEVELS
from kisao.utils import get_substitutable_algorithms
import functools
import natsort
import stringcase


def handler(algorithms):
    """ Get a list of algorithms similar to each of a list of algorithms

    Args:
        algorithms (:obj:`list` of :obj:`str`): KiSAO id of an algorithm

    Returns:
        :obj:`list` of ``KisaoAlgorithmSubstitution``
    """
    algorithms.sort()
    algorithmsStr = '&'.join(algorithms)
    return get_similar_algorithms_for_algorithms(algorithmsStr)


@functools.lru_cache(maxsize=None)
def get_similar_algorithms_for_algorithms(algorithmsStr):
    """ Get a list of algorithms similar to each of a list of algorithms

    Args:
        algorithms (:obj:`str`): '&'-separated list of KiSAO ids of algorithms

    Returns:
        :obj:`list` of ``KisaoAlgorithmSubstitution``
    """
    algorithms = algorithmsStr.split('&')

    return_value = []
    for algorithm in algorithms:
        return_value.extend(get_similar_algorithms_for_algorithm(algorithm))

    return natsort.natsorted(return_value,
                             key=lambda v:
                             (v['algorithms'][0]['name'], v['minPolicy']['level'], v['algorithms'][1]['name']))


@functools.lru_cache(maxsize=None)
def get_similar_algorithms_for_algorithm(algorithm):
    """ Get a list of algorithms similar to each of a list of algorithms

    Args:
        algorithm (:obj:`str`): KiSAO id of an algorithm

    Returns:
        :obj:`list` of ``KisaoAlgorithmSubstitution``
    """
    kisao = Kisao()
    try:
        alg_term = kisao.get_term(algorithm)
    except ValueError as exception:
        raise BadRequestException(
            title='{} is not an id for a KiSAO term.'.format(algorithm),
            instance=exception,
        )
    all_alg_terms = list(kisao.get_term('KISAO_0000000').subclasses())
    if alg_term not in all_alg_terms:
        raise BadRequestException(
            title='{} is not an id for a KiSAO algorithm term.'.format(algorithm),
            instance=ValueError('{} is not an id for a KiSAO algorithm term.'.format(algorithm)),
        )

    alt_alg_policies = get_substitutable_algorithms(alg_term)

    return_value = []
    for alt_alg, policy in alt_alg_policies.items():
        return_value.append({
            "_type": "KisaoAlgorithmSubstitution",
            "algorithms": [
                {
                    "_type": "KisaoTerm",
                    "id": kisao.get_term_id(alg_term),
                    "name": alg_term.name,
                },
                {
                    "_type": "KisaoTerm",
                    "id": kisao.get_term_id(alt_alg),
                    "name": alt_alg.name,
                }
            ],
            "minPolicy": {
                "_type": "KisaoAlgorithmSubstitutionPolicy",
                "id": policy.name,
                "name": stringcase.sentencecase(policy.name.lower()),
                "level": ALGORITHM_SUBSTITUTION_POLICY_LEVELS[policy],
            }
        })
    return return_value
