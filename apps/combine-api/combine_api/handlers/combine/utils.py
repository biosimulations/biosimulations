from ...exceptions import BadRequestException
from biosimulators_utils.sedml.data_model import (
    SedDocument,
    Style,
    LineStyle,
    MarkerStyle,
    FillStyle,
    Color,
    LineStyleType,
    MarkerStyleType,
    Model,
    ModelAttributeChange,
    AddElementModelChange,
    ReplaceElementModelChange,
    RemoveElementModelChange,
    ComputeModelChange,
    OneStepSimulation,
    SteadyStateSimulation,
    UniformTimeCourseSimulation,
    Algorithm,
    AlgorithmParameterChange,
    Task,
    DataGenerator,
    Variable,
    Report,
    Plot2D,
    Plot3D,
    DataSet,
    Curve,
    Surface,
    AxisScale,
    Parameter,
)


def export_sed_doc(sed_doc_specs):
    """ Export the specifications of SED-ML document to SED-ML

    Args:
        sed_doc_specs (``SedDocument``)

    Returns:
        :obj:`SedDocument`
    """
    sed_doc = SedDocument(
        level=sed_doc_specs['level'],
        version=sed_doc_specs['version'],
    )

    # add styles to SED-ML document
    style_id_map = {}
    for style_spec in sed_doc_specs['styles']:
        style = Style(
            id=style_spec.get('id'),
            name=style_spec.get('name', None),
        )
        sed_doc.styles.append(style)
        style_id_map[style.id] = style

        if style_spec.get('line', None) is not None:
            style.line = LineStyle(
                type=style_spec['line'].get('type', None),
                color=style_spec['line'].get('color', None),
                thickness=style_spec['line'].get('thickness', None),
            )
            if style_spec['line'].get('type', None) is not None:
                style.line.type = LineStyleType[style_spec['line']['type']]
            if style_spec['line'].get('color', None) is not None:
                style.line.color = Color(style_spec['line']['color'])

        if style_spec.get('marker', None) is not None:
            style.marker = MarkerStyle(
                type=style_spec['marker'].get('type', None),
                size=style_spec['marker'].get('size', None),
                line_color=style_spec['marker'].get('lineColor', None),
                line_thickness=style_spec['marker'].get('lineThickness', None),
                fill_color=style_spec['marker'].get('fillColor', None),
            )
            if style_spec['marker'].get('type', None) is not None:
                style.marker.type = MarkerStyleType[style_spec['marker']['type']]
            if style_spec['marker'].get('lineColor', None) is not None:
                style.marker.line_color = Color(style_spec['marker']['lineColor'])
            if style_spec['marker'].get('fillColor', None) is not None:
                style.marker.fill_color = Color(style_spec['marker']['fillColor'])

        if style_spec.get('fill', None) is not None:
            style.fill = FillStyle(
                color=style_spec['fill'].get('color', None),
            )
            if style_spec['fill'].get('color', None) is not None:
                style.fill.color = Color(style_spec['fill']['color'])

    for style_spec, style in zip(sed_doc_specs['styles'], sed_doc.styles):
        if style_spec.get('base', None) is not None:
            style.base = style_id_map.get(style_spec['base'], None)
            if style.base is None:
                raise BadRequestException(
                    title='Base style `{}` for style `{}` does not exist'.format(
                        style_spec['base'], style.id),
                    instance=ValueError('Style does not exist'),
                )

    # add models to SED-ML document
    model_id_map = {}
    for model_spec in sed_doc_specs['models']:
        model = Model(
            id=model_spec.get('id'),
            name=model_spec.get('name', None),
            language=model_spec.get('language'),
            source=model_spec.get('source'),
        )
        sed_doc.models.append(model)
        model_id_map[model.id] = model

        for change_spec in model_spec['changes']:
            if change_spec['_type'] == 'SedModelAttributeChange':
                change = ModelAttributeChange(
                    new_value=change_spec.get('newValue'),
                )

            elif change_spec['_type'] == 'SedAddElementModelChange':
                change = AddElementModelChange(
                    new_elements=change_spec.get('newElements'),
                )

            elif change_spec['_type'] == 'SedReplaceElementModelChange':
                change = ReplaceElementModelChange(
                    new_elements=change_spec.get('newElements'),
                )

            elif change_spec['_type'] == 'SedRemoveElementModelChange':
                change = RemoveElementModelChange()

            elif change_spec['_type'] == 'SedComputeModelChange':
                change = ComputeModelChange(
                    parameters=[],
                    variables=[],
                    math=change_spec.get('math'),
                )
                for parameter_spec in change_spec.get('parameters', []):
                    change.parameters.append(Parameter(
                        id=parameter_spec.get('id'),
                        name=parameter_spec.get('name', None),
                        value=parameter_spec.get('value'),
                    ))
                for variable_spec in change_spec.get('variables', []):
                    change.variables.append(Variable(
                        id=variable_spec.get('id'),
                        name=variable_spec.get('name', None),
                        model=variable_spec.get('model', None),
                        target=variable_spec.get('target', {}).get('value', None),
                        target_namespaces={
                            namespace['prefix']: namespace['uri']
                            for namespace in variable_spec.get('target', {}).get('namespaces', [])
                        },
                        symbol=variable_spec.get('symbol', None),
                        task=variable_spec.get('task', None),
                    ))

            else:
                raise BadRequestException(
                    title='Changes of type `{}` are not supported'.format(
                        change_spec['_type']),
                    instance=NotImplementedError('Invalid change')
                )

            change.target = change_spec.get('target').get('value')
            for ns in change_spec.get('target').get('namespaces', []):
                change.target_namespaces[ns.get('prefix', None)] = ns['uri']

            model.changes.append(change)

    # add simulations to SED-ML document
    simulation_id_map = {}
    for sim_spec in sed_doc_specs['simulations']:
        if sim_spec['_type'] == 'SedOneStepSimulation':
            sim = OneStepSimulation(
                id=sim_spec.get('id'),
                name=sim_spec.get('name', None),
                step=sim_spec.get('step'),
            )
        elif sim_spec['_type'] == 'SedSteadyStateSimulation':
            sim = SteadyStateSimulation(
                id=sim_spec.get('id'),
                name=sim_spec.get('name', None),
            )
        elif sim_spec['_type'] == 'SedUniformTimeCourseSimulation':
            sim = UniformTimeCourseSimulation(
                id=sim_spec.get('id'),
                name=sim_spec.get('name', None),
                initial_time=sim_spec.get('initialTime'),
                output_start_time=sim_spec.get('outputStartTime'),
                output_end_time=sim_spec.get('outputEndTime'),
                number_of_steps=sim_spec.get('numberOfSteps'),
            )
        else:
            raise BadRequestException(
                title='Simulations of type `{}` are not supported'.format(
                    sim_spec['_type']),
                instance=NotImplementedError('Invalid simulation')
            )  # pragma: no cover: unreachable due to schema validation

        alg_spec = sim_spec.get('algorithm')
        sim.algorithm = Algorithm(kisao_id=alg_spec.get('kisaoId'))
        for change_spec in alg_spec.get('changes'):
            sim.algorithm.changes.append(
                AlgorithmParameterChange(
                    kisao_id=change_spec.get('kisaoId'),
                    new_value=change_spec.get('newValue'),
                )
            )

        sed_doc.simulations.append(sim)
        simulation_id_map[sim.id] = sim

    # add tasks to SED-ML document
    task_id_map = {}
    for task_spec in sed_doc_specs['tasks']:
        if task_spec['_type'] == 'SedTask':
            model_id = task_spec.get('model')
            sim_id = task_spec.get('simulation')
            model = model_id_map.get(model_id, None)
            sim = simulation_id_map.get(sim_id, None)

            if not model:
                raise BadRequestException(
                    title='Model `{}` for task `{}` does not exist'.format(
                        model_id, task_spec.get('id')),
                    instance=ValueError('Model does not exist'),
                )
            if not sim:
                raise BadRequestException(
                    title='Simulation `{}` for task `{}` does not exist'.format(
                        sim_id, task_spec.get('id')),
                    instance=ValueError('Simulation does not exist'),
                )

            task = Task(
                id=task_spec.get('id'),
                name=task_spec.get('name', None),
                model=model,
                simulation=sim,
            )
        else:
            # TODO: support repeated tasks
            raise BadRequestException(
                title='Tasks of type `{}` are not supported'.format(
                    task_spec['_type']),
                instance=NotImplementedError('Invalid task')
            )  # pragma: no cover: unreachable due to schema validation

        sed_doc.tasks.append(task)
        task_id_map[task.id] = task

    # add data generators to SED-ML document
    data_gen_id_map = {}
    for data_gen_spec in sed_doc_specs['dataGenerators']:
        data_gen = DataGenerator(
            id=data_gen_spec.get('id'),
            name=data_gen_spec.get('name', None),
            math=data_gen_spec.get('math'),
        )

        for var_spec in data_gen_spec['variables']:
            task_id = var_spec.get('task')
            task = task_id_map.get(task_id, None)

            if not task:
                raise BadRequestException(
                    title='Task `{}` for variable `{}` does not exist'.format(
                        task_id, var_spec.get('id')),
                    instance=ValueError('Task does not exist'),
                )

            var = Variable(
                id=var_spec.get('id'),
                name=var_spec.get('name', None),
                task=task,
                symbol=var_spec.get('symbol', None),
            )

            target_spec = var_spec.get('target', None)
            if target_spec:
                var.target = target_spec['value']
                for ns in target_spec.get('namespaces', []):
                    var.target_namespaces[ns.get('prefix', None)] = ns['uri']

            data_gen.variables.append(var)

        sed_doc.data_generators.append(data_gen)
        data_gen_id_map[data_gen.id] = data_gen

    # add outputs to SED-ML document
    for output_spec in sed_doc_specs['outputs']:
        if output_spec['_type'] == 'SedReport':
            output = Report(
                id=output_spec.get('id'),
                name=output_spec.get('name', None),
            )
            for data_set_spec in output_spec['dataSets']:
                data_gen_id = data_set_spec['dataGenerator']
                data_gen = data_gen_id_map.get(
                    data_gen_id, None)

                if not data_gen:
                    raise BadRequestException(
                        title='Data generator `{}` for output `{}` does not exist'.format(
                            data_gen_id, output_spec.get('id')),
                        instance=ValueError('Data generator does not exist'),
                    )

                data_set = DataSet(
                    id=data_set_spec.get('id'),
                    name=data_set_spec.get('name', None),
                    label=data_set_spec.get('label', None),
                    data_generator=data_gen,
                )
                output.data_sets.append(data_set)

        elif output_spec['_type'] == 'SedPlot2D':
            output = Plot2D(
                id=output_spec.get('id'),
                name=output_spec.get('name', None),
            )
            for curve_spec in output_spec['curves']:
                x_data_gen_id = curve_spec['xDataGenerator']
                y_data_gen_id = curve_spec['yDataGenerator']
                style_id = curve_spec.get('style', None)
                x_data_gen = data_gen_id_map.get(x_data_gen_id, None)
                y_data_gen = data_gen_id_map.get(y_data_gen_id, None)
                style = style_id_map.get(style_id, None)

                if not x_data_gen:
                    raise BadRequestException(
                        title='X data generator `{}` for curve `{}` does not exist'.format(
                            x_data_gen_id, output_spec.get('id')),
                        instance=ValueError('Data generator does not exist'),
                    )
                if not y_data_gen:
                    raise BadRequestException(
                        title='Y data generator `{}` for curve `{}` does not exist'.format(
                            y_data_gen_id, output_spec.get('id')),
                        instance=ValueError('Data generator does not exist'),
                    )
                if style_id is not None and style is None:
                    raise BadRequestException(
                        title='Style `{}` for curve `{}` does not exist'.format(
                            style_id, output_spec.get('id')),
                        instance=ValueError('Style does not exist'),
                    )

                curve = Curve(
                    id=curve_spec.get('id'),
                    name=curve_spec.get('name', None),
                    x_data_generator=x_data_gen,
                    y_data_generator=y_data_gen,
                    x_scale=AxisScale[output_spec['xScale']],
                    y_scale=AxisScale[output_spec['yScale']],
                    style=style,
                )
                output.curves.append(curve)

        elif output_spec['_type'] == 'SedPlot3D':
            output = Plot3D(
                id=output_spec.get('id'),
                name=output_spec.get('name', None),
            )
            for surface_spec in output_spec['surfaces']:
                x_data_gen_id = surface_spec['xDataGenerator']
                y_data_gen_id = surface_spec['yDataGenerator']
                z_data_gen_id = surface_spec['zDataGenerator']
                style_id = surface_spec.get('style', None)
                x_data_gen = data_gen_id_map.get(x_data_gen_id, None)
                y_data_gen = data_gen_id_map.get(y_data_gen_id, None)
                z_data_gen = data_gen_id_map.get(z_data_gen_id, None)
                style = style_id_map.get(style_id, None)

                if not x_data_gen:
                    raise BadRequestException(
                        title='X data generator `{}` for surface `{}` does not exist'.format(
                            x_data_gen_id, output_spec.get('id')),
                        instance=ValueError('Data generator does not exist'),
                    )
                if not y_data_gen:
                    raise BadRequestException(
                        title='Y data generator `{}` for surface `{}` does not exist'.format(
                            y_data_gen_id, output_spec.get('id')),
                        instance=ValueError('Data generator does not exist'),
                    )
                if not z_data_gen:
                    raise BadRequestException(
                        title='X data generator `{}` for surface `{}` does not exist'.format(
                            z_data_gen_id, output_spec.get('id')),
                        instance=ValueError('Data generator does not exist'),
                    )
                if style_id is not None and style is None:
                    raise BadRequestException(
                        title='Style `{}` for surface `{}` does not exist'.format(
                            style_id, output_spec.get('id')),
                        instance=ValueError('Style does not exist'),
                    )

                surface = Surface(
                    id=surface_spec.get('id'),
                    name=surface_spec.get('name', None),
                    x_data_generator=x_data_gen,
                    y_data_generator=y_data_gen,
                    z_data_generator=z_data_gen,
                    x_scale=AxisScale[output_spec['xScale']],
                    y_scale=AxisScale[output_spec['yScale']],
                    z_scale=AxisScale[output_spec['zScale']],
                    style=style,
                )
                output.surfaces.append(surface)

        else:
            raise BadRequestException(
                title='Outputs of type `{}` are not supported'.format(
                    output_spec['_type']),
                instance=NotImplementedError('Invalid output')
            )  # pragma: no cover: unreachable due to schema validation

        sed_doc.outputs.append(output)

    # deserialize references
    model_map = {}
    for model in sed_doc.models:
        model_map[model.id] = model

    task_map = {}
    for task in sed_doc.tasks:
        task_map[task.id] = task

    for model in sed_doc.models:
        for change in model.changes:
            if isinstance(change, ComputeModelChange):
                for variable in change.variables:
                    if variable.model:
                        variable.model = model_map[variable.model]
                    if variable.task:
                        variable.task = task_map[variable.task]

    return sed_doc
