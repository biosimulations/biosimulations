from ...exceptions import BadRequestException
from kisao import Kisao
from kisao.data_model import ALGORITHM_SUBSTITUTION_POLICY_LEVELS
from kisao.utils import get_substitutable_algorithms
import natsort
import stringcase


def handler(algorithm):
    """ Get a list of algorithms similar to an algorithm

    Args:
        algorithm (:obj:`str`): KiSAO id of an algorithm

    Returns:
        :obj:``#/components/schemas/AlgorithmSubstitution``
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
            "algorithm": {
                "_type": "KisaoTerm",
                "id": kisao.get_term_id(alt_alg),
                "name": alt_alg.name,
            },
            "maxPolicy": {
                "_type": "KisaoAlgorithmSubstitutionPolicy",
                "id": policy.name,
                "name": stringcase.sentencecase(policy.name.lower()),
                "level": ALGORITHM_SUBSTITUTION_POLICY_LEVELS[policy],
            }
        })

    return natsort.natsorted(return_value, key=lambda v: (v['maxPolicy']['level'], v['algorithm']['name']))
