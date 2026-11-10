"""Use case diagram for the VFast License Management System, drawn with srsdiagram (see its docstring for requirements).

Run from docs/diagrams:  python ve_license.py
Writes .svg, .png and .drawio files to docs/diagrams/out/.
"""
import os

import srsdiagram as sd

HERE = os.path.dirname(os.path.abspath(__file__))


def uc_license_management():
    u = sd.UseCase('License Management System')
    u.actor('admin', 'Admin')
    u.actor('job', 'Scheduled Job', 'right')
    for key, name in [
        ('overview', 'View License Overview Metrics'),
        ('list', 'View License List'),
        ('detail', 'View License Detail'),
        ('kpi', 'View Analytics KPIs'),
        ('usage', 'View Application Usage'),
        ('breakdown', 'View Spend and Usage Breakdown'),
        ('sync', 'Upload and Sync License Data'),
        ('measure', 'Measure License Usage Effectiveness'),
    ]:
        u.uc(key, name)
    u.link('admin', 'overview', 'list', 'detail', 'kpi', 'usage', 'breakdown', 'sync', 'measure')
    u.link('job', 'sync')
    return u.build()


if __name__ == '__main__':
    paths = sd.save({
        'uc_license_management': (uc_license_management(), 'License Management System'),
    }, os.path.join(HERE, 'out'))
    print('\n'.join(paths))
