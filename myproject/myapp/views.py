from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse
from django.http import HttpResponse
from rest_framework.parsers import JSONParser

from myapp.models import WheelSpecification, BogieChecksheet
from myapp.serializers import WheelSpecificationSerializer, BogieChecksheetSerializer


@csrf_exempt
def wheel_specification_api(request, id=0):
    if request.method == 'GET':
        forms = WheelSpecification.objects.all()
        serializer = WheelSpecificationSerializer(forms, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = WheelSpecificationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        form = WheelSpecification.objects.get(id=id)
        serializer = WheelSpecificationSerializer(form, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        form = WheelSpecification.objects.get(id=id)
        form.delete()
        return HttpResponse(status=204)


@csrf_exempt
def bogie_checksheet_api(request, id=0):
    if request.method == 'GET':
        forms = BogieChecksheet.objects.all()
        serializer = BogieChecksheetSerializer(forms, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = BogieChecksheetSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        form = BogieChecksheet.objects.get(id=id)
        serializer = BogieChecksheetSerializer(form, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        form = BogieChecksheet.objects.get(id=id)
        form.delete()
        return HttpResponse(status=204)
