
import json
import sys

def run():
    _, sourceFileName, targetFileName = sys.argv
    originalDifferenceEntries = readJsonIntoMemory(sourceFileName)
    for differenceEntry in originalDifferenceEntries:
        startTime = differenceEntry["start_time"]
        # endTime = differenceEntry["end_time"]
        startTimeMs = convertToMs(startTime)
        # endTimeMs = convertToMs(endTime)
        differenceEntry["start_time_ms"] = startTimeMs
        # differenceEntry["end_time_ms"] = endTimeMs
    writeJson(originalDifferenceEntries, targetFileName)

def convertToMs(originalTime: str):
    hmsString, millisecondsString = originalTime.split(".")
    hours, minutes, seconds = [int(digits) for digits in hmsString.split(":")]
    subSecondsDigits = int(millisecondsString[0:3])
    print(subSecondsDigits)
    #milliseconds = int(str(round(subSecondsDigits, -1))[0:-1])
    return subSecondsDigits + seconds * 1000 + minutes * (60*1000) + hours * (60*60*1000)


def readJsonIntoMemory(fileName):
    with open(fileName, 'r') as file:
        return json.load(file)

def writeJson(differenceEntries, targetFileName):
    with open(targetFileName, 'w', encoding='utf-8') as file:
        json.dump(differenceEntries, file, indent=4)

run()