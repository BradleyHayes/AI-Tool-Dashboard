"""
==== Designed by Brad Hayes with Google AI Studio ====
==== project_module.py
==== Version 1.0 : 3/15/2026
"""

import PySimpleGUI as sg

def get_layout(colors):
    projects = [
        {'name': 'Aura Desktop', 'status': 'In Progress', 'progress': 60},
        {'name': 'Local LLM Integration', 'status': 'Planning', 'progress': 20},
        {'name': 'Data Viz Tool', 'status': 'Completed', 'progress': 100}
    ]
    
    project_rows = []
    for p in projects:
        row = [
            sg.Frame(p['name'], [
                [sg.Text(f"Status: {p['status']}", background_color=colors['bg_light'])],
                [sg.ProgressBar(100, orientation='h', size=(20, 20), key=f"-PROG-{p['name']}-", bar_color=(colors['primary'], 'white'))]
            ], background_color=colors['bg_light'], expand_x=True)
        ]
        project_rows.append(row)
        
    layout = [
        [sg.Text('Project Hub', font=('Space Grotesk', 20, 'bold'), text_color=colors['text'], background_color=colors['dashboard_bg'])],
        [sg.Column(project_rows, background_color=colors['dashboard_bg'], scrollable=True, vertical_scroll_only=True, expand_x=True, expand_y=True)]
    ]
    
    return layout

def handle_events(event, values, window):
    # Handle project specific interactions here
    pass
