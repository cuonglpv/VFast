"""Use case diagrams for VFast ELMS, drawn with srsdiagram (see its docstring for requirements).

Run from docs/diagrams:  python ve_elms.py
Writes .svg, .png and .drawio files to docs/diagrams/out/.
"""
import os

import srsdiagram as sd

HERE = os.path.dirname(os.path.abspath(__file__))


def overview():
    """One diagram for the README: use cases grouped by capability; UC29 Login / Logout is shared by all roles."""
    u = sd.UseCase('VFast ELMS — Use case overview')
    u.actor('mgr', 'Manager')
    u.actor('stf', 'Staff')
    u.actor('emp', 'Employee')
    u.actor('sys', 'Lifecycle Scheduler', 'right')
    for key, name in [
        ('g_lic', 'Manage catalog, vendors, entitlements, contracts (UC01–04)'),
        ('g_cmp', 'Check compliance and detect overuse (UC05, UC21)'),
        ('g_alc', 'Review, approve, assign, revoke licenses (UC07–11)'),
        ('g_bud', 'Manage budget and monitor utilization (UC12, UC14)'),
        ('g_exp', 'Manage expenses and invoices (UC13, UC33–35)'),
        ('g_lfc', 'Track expiry, renewal, maintenance (UC15–17)'),
        ('g_ntf', 'Generate lifecycle notifications (UC18)'),
        ('g_opt', 'Review optimization recommendations (UC19–20, UC22)'),
        ('g_dsh', 'View dashboards and export reports (UC23–26)'),
        ('g_adm', 'Manage users, roles, audit logs (UC27–28, UC30)'),
        ('g_use', 'Enter or import license usage (UC31–32)'),
        ('g_sub', 'View submitted data (UC36)'),
        ('g_cat', 'View available software (UC37)'),
        ('g_req', 'Submit a license request (UC06)'),
        ('g_my', 'View own requests and licenses (UC11, UC38–39)'),
    ]:
        u.uc(key, name)
    u.link('mgr', 'g_lic', 'g_cmp', 'g_alc', 'g_bud', 'g_exp', 'g_lfc', 'g_opt', 'g_dsh', 'g_adm')
    u.link('stf', 'g_exp', 'g_use', 'g_sub')
    u.link('emp', 'g_cat', 'g_req', 'g_my')
    u.link('sys', 'g_ntf')
    return u.build()


def manager_license():
    u = sd.UseCase('Manager (1/2): licenses')
    u.actor('mgr', 'Manager')
    u.actor('sys', 'Lifecycle Scheduler', 'right')
    for key, name in [
        ('uc29', 'UC29 Login / Logout'),
        ('uc01', 'UC01 Manage Software Catalog'),
        ('uc02', 'UC02 Manage Vendor'),
        ('uc03', 'UC03 Manage License Entitlement'),
        ('uc04', 'UC04 Manage Contract'),
        ('uc05', 'UC05 Check License Compliance'),
        ('uc07', 'UC07 Review License Request'),
        ('uc08', 'UC08 Approve / Reject Request'),
        ('uc09', 'UC09 Assign License'),
        ('uc10', 'UC10 Revoke License'),
        ('uc11', 'UC11 Track License Allocation'),
        ('uc15', 'UC15 Track License Expiration'),
        ('uc16', 'UC16 Manage Renewal'),
        ('uc17', 'UC17 Track Maintenance'),
        ('uc18', 'UC18 Generate Lifecycle Notification'),
    ]:
        u.uc(key, name)
    u.link('mgr', 'uc29', 'uc01', 'uc02', 'uc03', 'uc04', 'uc05', 'uc07', 'uc08', 'uc09', 'uc10', 'uc11',
           'uc15', 'uc16', 'uc17')
    u.link('sys', 'uc18')
    return u.build()


def manager_finance():
    u = sd.UseCase('Manager (2/2): budget and analytics')
    u.actor('mgr', 'Manager')
    for key, name in [
        ('uc12', 'UC12 Manage Budget'),
        ('uc13', 'UC13 Manage Expense'),
        ('uc14', 'UC14 Monitor Budget Utilization'),
        ('uc19', 'UC19 Detect Unallocated Licenses'),
        ('uc20', 'UC20 Detect Inactive Assignments'),
        ('uc21', 'UC21 Detect License Overuse'),
        ('uc22', 'UC22 Review Optimization Recommendations'),
        ('uc23', 'UC23 View License Dashboard'),
        ('uc24', 'UC24 View Financial Dashboard'),
        ('uc25', 'UC25 View Compliance Dashboard'),
        ('uc26', 'UC26 Export Reports'),
        ('uc27', 'UC27 Manage Users'),
        ('uc28', 'UC28 Manage Roles'),
        ('uc30', 'UC30 View Audit Logs'),
    ]:
        u.uc(key, name)
    u.link('mgr', *[k for k, _ in u.ucs])
    return u.build()


def staff():
    u = sd.UseCase('Staff')
    u.actor('stf', 'Staff')
    for key, name in [
        ('uc29', 'UC29 Login / Logout'),
        ('uc31', 'UC31 Input License Usage'),
        ('uc32', 'UC32 Import License Usage (CSV/Excel)'),
        ('uc33', 'UC33 Input Expense Data'),
        ('uc34', 'UC34 Import Expense Data (CSV/Excel)'),
        ('uc35', 'UC35 Upload Supporting Documents'),
        ('uc13', 'UC13 Manage Expense'),
        ('uc36', 'UC36 View Submitted Data'),
        ('uc26', 'UC26 Export Reports'),
    ]:
        u.uc(key, name)
    u.link('stf', *[k for k, _ in u.ucs])
    return u.build()


def employee():
    u = sd.UseCase('Employee')
    u.actor('emp', 'Employee')
    for key, name in [
        ('uc29', 'UC29 Login / Logout'),
        ('uc37', 'UC37 View Available Software'),
        ('uc06', 'UC06 Submit License Request'),
        ('uc38', 'UC38 View Own Request Status'),
        ('uc39', 'UC39 View Own Assigned Licenses'),
        ('uc11', 'UC11 Track Personal Allocation'),
    ]:
        u.uc(key, name)
    u.link('emp', *[k for k, _ in u.ucs])
    return u.build()


if __name__ == '__main__':
    paths = sd.save({
        'uc_overview': (overview(), 'Use case overview'),
        'uc_manager_license': (manager_license(), 'Manager: licenses'),
        'uc_manager_finance': (manager_finance(), 'Manager: budget and analytics'),
        'uc_staff': (staff(), 'Staff'),
        'uc_employee': (employee(), 'Employee'),
    }, os.path.join(HERE, 'out'))
    print('\n'.join(paths))
