"""
==== Designed by Brad Hayes with Google AI Studio ====
==== task_module.py
==== Version 1.0 : 3/15/2026
"""

import PySimpleGUI as sg

def get_layout(colors):
    tasks = [
        ['Design UI', 'High'],
        ['Implement Auth', 'Medium'],
        ['Write Docs', 'Low']
    ]
    
    layout = [
        [sg.Text('Task Organizer', font=('Space Grotesk', 20, 'bold'), text_color=colors['text'], background_color=colors['dashboard_bg'])],
        [sg.Table(values=tasks, headings=['Task', 'Priority'], 
                  auto_size_columns=True,
                  display_row_numbers=False,
                  justification='left',
                  num_rows=10,
                  key='-TASK-TABLE-',
                  row_height=35,
                  header_background_color=colors['primary'],
                  background_color='white',
                  text_color='black',
                  expand_x=True)],
        [sg.Input(key='-NEW-TASK-', size=(40, 1)), 
         sg.Combo(['High', 'Medium', 'Low'], default_value='Medium', key='-PRIORITY-'),
         sg.Button('Add Task', key='-ADD-TASK-', button_color=('white', colors['accent']))]
    ]
    return layout

def handle_events(event, values, window):
    if event == '-ADD-TASK-':
        new_task = values['-NEW-TASK-']
        priority = values['-PRIORITY-']
        if new_task:
            current_tasks = window['-TASK-TABLE-'].get()
            current_tasks.append([new_task, priority])
            window['-TASK-TABLE-'].update(values=current_tasks)
            window['-NEW-TASK-'].update('')
