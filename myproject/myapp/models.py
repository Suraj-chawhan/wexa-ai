

from django.db import models

# --- Wheel Specification Form ---
class WheelSpecification(models.Model):
    formNumber = models.CharField(max_length=100, unique=True)
    submittedBy = models.CharField(max_length=100)
    submittedDate = models.DateField()
    treadDiameterNew = models.CharField(max_length=100)
    lastShopIssueSize = models.CharField(max_length=100)
    condemningDia = models.CharField(max_length=100)
    wheelGauge = models.CharField(max_length=100)
    variationSameAxle = models.CharField(max_length=50)
    variationSameBogie = models.CharField(max_length=50)
    variationSameCoach = models.CharField(max_length=50)
    wheelProfile = models.CharField(max_length=100)
    intermediateWWP = models.CharField(max_length=100)
    bearingSeatDiameter = models.CharField(max_length=100)
    rollerBearingOuterDia = models.CharField(max_length=100)
    rollerBearingBoreDia = models.CharField(max_length=100)
    rollerBearingWidth = models.CharField(max_length=100)
    axleBoxHousingBoreDia = models.CharField(max_length=100)
    wheelDiscWidth = models.CharField(max_length=100)

# --- Bogie Checksheet Form ---
class BogieChecksheet(models.Model):
    formNumber = models.CharField(max_length=100, unique=True)
    inspectionBy = models.CharField(max_length=100)
    inspectionDate = models.DateField()
 # bogieDetails
    bogieNo = models.CharField(max_length=50)
    makerYearBuilt = models.CharField(max_length=50)
    incomingDivAndDate = models.CharField(max_length=100)
    deficitComponents = models.CharField(max_length=200)
    dateOfIOH = models.DateField()
    # bogieChecksheet
    bogieFrameCondition = models.CharField(max_length=50)
    bolster = models.CharField(max_length=50)
    bolsterSuspensionBracket = models.CharField(max_length=50)
    lowerSpringSeat = models.CharField(max_length=50)
    axleGuide = models.CharField(max_length=50)
    # bmbcChecksheet
    cylinderBody = models.CharField(max_length=50)
    pistonTrunnion = models.CharField(max_length=50)
    adjustingTube = models.CharField(max_length=50)
    plungerSpring = models.CharField(max_length=50)

