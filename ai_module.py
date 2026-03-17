"""
==== Designed by Brad Hayes with Google AI Studio ====
==== ai_module.py
==== Version 1.0 : 3/15/2026
"""

import PySimpleGUI as sg
import threading
import os
import prompt_builder_module

# Note: For local AI, we suggest using 'ollama' or 'transformers'
try:
    import ollama
    HAS_OLLAMA = True
except ImportError:
    HAS_OLLAMA = False

def get_layout(colors):
    left_column = [
        [sg.Text('AI Assistant', font=('Space Grotesk', 20, 'bold'), text_color=colors['text'], background_color=colors['dashboard_bg']),
         sg.Push(background_color=colors['dashboard_bg']),
         sg.Button('Toggle Prompt Builder', key='-TOGGLE-BUILDER-', button_color=('white', colors['secondary']))],
        [sg.Text('Model:', background_color=colors['dashboard_bg']), 
         sg.Combo(['llama3', 'mistral', 'codellama', 'phi3'], default_value='llama3', key='-AI-MODEL-', size=(15, 1))],
        [sg.Text('System Prompt:', background_color=colors['dashboard_bg'])],
        [sg.Input(default_text="You are a helpful assistant.", key='-SYSTEM-PROMPT-', expand_x=True)],
        [sg.Multiline(size=(60, 15), key='-CHAT-HISTORY-', disabled=True, background_color='white', text_color='black', expand_x=True, expand_y=True)],
        [sg.Input(key='-CHAT-INPUT-', size=(50, 1), expand_x=True), 
         sg.Button('Send', key='-SEND-CHAT-', button_color=('white', colors['primary']), bind_return_key=True)]
    ]

    right_sidebar = prompt_builder_module.get_layout(colors, is_sidebar=True)

    layout = [
        [sg.Column(left_column, background_color=colors['dashboard_bg'], expand_x=True, expand_y=True, pad=(10, 10)),
         sg.Column(right_sidebar, key='-AI-SIDEBAR-', background_color=colors['bg_light'], expand_y=True, pad=(10, 10), visible=True)]
    ]
    return layout

def handle_events(event, values, window):
    # Handle Toggle
    if event == '-TOGGLE-BUILDER-':
        is_visible = window['-AI-SIDEBAR-'].visible
        window['-AI-SIDEBAR-'].update(visible=not is_visible)

    # Delegate to prompt builder module
    if prompt_builder_module.handle_events(event, values, window):
        # If True, it means 'Send to AI' was clicked
        builder_text = values['-PROMPT-BUILDER-']
        window['-CHAT-INPUT-'].update(builder_text)
        window.write_event_value('-SEND-CHAT-', None)

    if event == '-SEND-CHAT-':
        user_msg = values['-CHAT-INPUT-']
        model = values['-AI-MODEL-']
        system_prompt = values['-SYSTEM-PROMPT-']
        
        if not user_msg:
            return
            
        window['-CHAT-HISTORY-'].update(f"You: {user_msg}\n", append=True)
        window['-CHAT-INPUT-'].update('')
        
        threading.Thread(target=get_ai_response, args=(user_msg, model, system_prompt, window), daemon=True).start()

    if event == '-AI-RESPONSE-':
        history = window['-CHAT-HISTORY-'].get()
        new_history = history.replace("AI: Thinking...\n", "")
        window['-CHAT-HISTORY-'].update(new_history)
        window['-CHAT-HISTORY-'].update(f"AI: {values['-AI-RESPONSE-']}\n\n", append=True)

def get_ai_response(prompt, model, system_prompt, window):
    window['-CHAT-HISTORY-'].update("AI: Thinking...\n", append=True)
    
    response_text = ""
    if HAS_OLLAMA:
        try:
            response = ollama.chat(model=model, messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': prompt},
            ])
            response_text = response['message']['content']
        except Exception as e:
            response_text = f"Error: {str(e)}"
    else:
        response_text = "Ollama not detected."

    window.write_event_value('-AI-RESPONSE-', response_text)
