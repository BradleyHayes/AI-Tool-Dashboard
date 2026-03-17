"""
==== Designed by Brad Hayes with Google AI Studio ====
==== prompt_builder_module.py
==== Version 1.0 : 3/15/2026
"""

import PySimpleGUI as sg
import os
import json

PROMPT_FILE = "prompt_builder_save.txt"
HISTORY_FILE = "prompt_history.json"

def load_history():
    if os.path.exists(HISTORY_FILE):
        try:
            with open(HISTORY_FILE, "r") as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_history(history):
    try:
        with open(HISTORY_FILE, "w") as f:
            json.dump(history, f)
    except:
        pass

def get_layout(colors, is_sidebar=True):
    templates = [
        "--- Basic ---",
        "Summarize this text:",
        "Explain this like I'm 5:",
        "Translate the following to Spanish:",
        "Extract key points from:",
        "--- Coding ---",
        "Refactor this code for better performance:",
        "Find potential bugs in this snippet:",
        "Write a Python unit test for:",
        "Add detailed comments to this code:",
        "Convert this logic to a different language:",
        "--- System ---",
        "You are a helpful assistant.",
        "You are a professional software engineer.",
        "You are a creative technical writer.",
        "You are a security auditor."
    ]

    saved_prompt = ""
    if os.path.exists(PROMPT_FILE):
        try:
            with open(PROMPT_FILE, "r") as f:
                saved_prompt = f.read()
        except:
            pass

    history = load_history()
    history_names = sorted(list(history.keys()))

    size_multiline = (30, 12) if is_sidebar else (80, 15)
    size_listbox = (30, 10) if is_sidebar else (40, 10)

    layout = [
        [sg.Text('AI Prompt Assist' if not is_sidebar else 'Prompt Builder', 
                 font=('Inter', 18 if not is_sidebar else 14, 'bold'), 
                 background_color=colors['bg_light'] if is_sidebar else colors['dashboard_bg'])],
        [sg.Text('History:', background_color=colors['bg_light'] if is_sidebar else colors['dashboard_bg'])],
        [sg.Combo(history_names, key='-HISTORY-COMBO-', size=(20 if is_sidebar else 40, 1), enable_events=True), 
         sg.Button('Load', key='-LOAD-HISTORY-', size=(5, 1)),
         sg.Button('X', key='-DELETE-HISTORY-', size=(2, 1), button_color=('white', '#ef4444'))],
        [sg.Text('Templates:', background_color=colors['bg_light'] if is_sidebar else colors['dashboard_bg'])],
        [sg.Listbox(values=templates, size=size_listbox, key='-TEMPLATE-LIST-', enable_events=True)],
        [sg.Text('Builder:', background_color=colors['bg_light'] if is_sidebar else colors['dashboard_bg'])],
        [sg.Multiline(default_text=saved_prompt, size=size_multiline, key='-PROMPT-BUILDER-', enable_events=True, expand_x=True, expand_y=True)],
        [sg.Button('Save Draft', key='-SAVE-PROMPT-', size=(12, 1)), 
         sg.Button('Add to History', key='-ADD-HISTORY-', size=(15, 1))],
        [sg.Button('Send to AI Assistant', key='-USE-PROMPT-', size=(30 if is_sidebar else 40, 1), button_color=('white', colors['accent']))]
    ]
    
    return layout

def handle_events(event, values, window):
    if event == '-PROMPT-BUILDER-':
        try:
            with open(PROMPT_FILE, "w") as f:
                f.write(values['-PROMPT-BUILDER-'])
        except:
            pass

    if event == '-TEMPLATE-LIST-':
        selected = values['-TEMPLATE-LIST-'][0]
        if not selected.startswith("---"):
            current = values['-PROMPT-BUILDER-']
            new_text = current + ("\n" if current and not current.endswith("\n") else "") + selected + " "
            window['-PROMPT-BUILDER-'].update(new_text)
            window.write_event_value('-PROMPT-BUILDER-', new_text)

    if event == '-SAVE-PROMPT-':
        try:
            with open(PROMPT_FILE, "w") as f:
                f.write(values['-PROMPT-BUILDER-'])
            sg.popup_quick_message("Draft Saved!", background_color='#40E0D0', text_color='white')
        except:
            pass

    if event == '-ADD-HISTORY-':
        prompt_text = values['-PROMPT-BUILDER-']
        if prompt_text:
            name = sg.popup_get_text("Enter a name for this prompt:", title="Save to History")
            if name:
                history = load_history()
                history[name] = prompt_text
                save_history(history)
                window['-HISTORY-COMBO-'].update(values=sorted(list(history.keys())), value=name)

    if event == '-LOAD-HISTORY-':
        name = values['-HISTORY-COMBO-']
        if name:
            history = load_history()
            if name in history:
                window['-PROMPT-BUILDER-'].update(history[name])
                window.write_event_value('-PROMPT-BUILDER-', history[name])

    if event == '-DELETE-HISTORY-':
        name = values['-HISTORY-COMBO-']
        if name:
            if sg.popup_yes_no(f"Delete '{name}'?") == 'Yes':
                history = load_history()
                if name in history:
                    del history[name]
                    save_history(history)
                    window['-HISTORY-COMBO-'].update(values=sorted(list(history.keys())), value='')

    if event == '-USE-PROMPT-':
        builder_text = values['-PROMPT-BUILDER-']
        if builder_text:
            # This will be handled by the main app to switch to AI tab
            return True
    return False
