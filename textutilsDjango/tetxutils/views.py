from django.http import HttpResponse
from django.shortcuts import render


def index(request):
    # with open('statics\data.txt', 'r') as file:
    # data = file.read()
    # return HttpResponse(f'<pre>{data}<pre/>')

    #     pipeline = [
    #     {
    #         'remove_punc': 'remove_punc'
    #     },
    #     {
    #         'capitalizefirst': 'capfirst'
    #     },
    #     {
    #         'newlineremove': 'newlineremove'
    #     },
    #     {
    #         'spaceremove': 'spaceremove'
    #     },
    #     {
    #         'countchars': 'countchars'
    #     }
    # ]

    # res_html = [f'''
    #     <div class='{label}'> <a href='{url}' target='_blank'>{label}<a/> <div/>
    #     ''' for endpoint in pipeline for label, url in endpoint.items()]
    # res_html = ' '.join(res_html)

    # return HttpResponse(res_html)

    params = {
        'title': 'TextUtils',
    }

    return render(request, 'index.html', params)


def favourites(request):
    favourites_list = [
        {
            'codewithharry': 'https://www.codewithharry.com/'
        },
        {
            'slack': 'https://app.slack.com/client/T077L9M2UQZ/C077K6WA9EJ'
        },
        {
            'muzammilbilwani': 'https://muzammilbilwani.com/'
        },
        {
            'github': 'https://github.com/Faisal-Mujtaba-Saleem'
        },
        {
            'Chat-GPT': 'https://chatgpt.com/?model=auto'
        }
    ]

    res_html = [f'''
    <div class='{fav}'> <a href='{fav_url}' target='_blank'>{fav}<a/> <div/>
    ''' for fav_dict in favourites_list for fav, fav_url in fav_dict.items()]
    res_html = ' '.join(res_html)

    return HttpResponse(res_html)


def analyze(request):
    text_to_utilize: str = request.POST.get('text', 'Not Recieved')
    remove_punc = request.POST.get('removepunc', 'off')
    fullcaps = request.POST.get('fullcaps', 'off')
    lowercaps = request.POST.get('lowercaps', 'off')
    capitalize = request.POST.get('capitalize_first', 'off')
    titleize = request.POST.get('titleize', 'off')
    remove_extra_space = request.POST.get('remove_extra_space', 'off')
    remove_newline = request.POST.get('remove_newline', 'off')
    countchars = request.POST.get('countchars', 'off')

    if remove_punc == 'on' or fullcaps == 'on' or lowercaps == 'on' or capitalize == 'on' or titleize == 'on' or remove_extra_space == 'on' or remove_newline == 'on' or countchars == 'on':

        analyzed_text = ''
        purpose = ''

        if remove_punc == 'on':
            purpose = 'Removed Punctuations'

            punclist = '''.,?!:;'"()[]—-.../\*&@_^~'''

            for char in text_to_utilize:
                if char not in punclist:
                    analyzed_text += char

        if fullcaps == 'on':
            if purpose != '':
                purpose += ', Converted to Uppercase'
            else:
                purpose = 'Converted to Uppercase'

            if analyzed_text != '':
                analyzed_text = analyzed_text.upper()
            else:
                analyzed_text = text_to_utilize.upper()

        if lowercaps == 'on':
            if purpose != '':
                purpose += ', Converted to Lowercase'
            else:
                purpose = 'Converted to Lowercase'

            if analyzed_text != '':
                analyzed_text = text_to_utilize.lower()
            else:
                analyzed_text = text_to_utilize.lower()

        if capitalize == 'on':
            if purpose != '':
                purpose += ', Capitalized'
            else:
                purpose = 'Capitalized'

            if analyzed_text != '':
                analyzed_text = text_to_utilize.capitalize()
            else:
                analyzed_text = text_to_utilize.capitalize()

        if titleize == 'on':
            if purpose != '':
                purpose += ', Titleized'
            else:
                purpose = 'Titleized'

            if analyzed_text != '':
                analyzed_text = text_to_utilize.title()
            else:
                analyzed_text = text_to_utilize.title()

        if remove_newline == 'on':
            if purpose != '':
                purpose += ', Removed New Lines'
            else:
                purpose = 'Removed New Lines'

            if analyzed_text != '':
                # temp = ''
                # for i, char in enumerate(analyzed_text):
                #     if not (char == '\n' or char == '\r'):
                #         temp += char
                # analyzed_text = temp
                analyzed_text = analyzed_text.replace('\r\n', '')

            else:
                # for i, char in enumerate(text_to_utilize):
                #     if not (char == '\n'):
                #         analyzed_text += char
                analyzed_text = text_to_utilize.replace('\r\n', '')

        if remove_extra_space == 'on':
            if purpose != '':
                purpose += ', Removed Extra Spaces'
            else:
                purpose = 'Removed Extra Spaces'

            if analyzed_text != '':
                temp = ''
                for i, char in enumerate(analyzed_text):
                    if not (analyzed_text[i] == ' ' and analyzed_text[i+1] == ' '):
                        temp += char
                analyzed_text = temp

            else:
                for i, char in enumerate(text_to_utilize):
                    if not (text_to_utilize[i] == ' ' and text_to_utilize[i+1] == ' '):
                        analyzed_text += char

        character_count = 0
        if countchars == 'on':
            if purpose != '':
                purpose += ', Counted Characters'
            else:
                purpose = 'Counted Characters'

            character_count = text_to_utilize.__len__()

        params = {
            'text_to_analyze': text_to_utilize,
            'purpose': purpose,
            'analyzed_text': analyzed_text,
            'character_count': character_count
        }
        print(params['analyzed_text'])

        return render(request, 'analyze.html', context=params)

    return HttpResponse('Please switch atleast one checkbox')
