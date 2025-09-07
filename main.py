<<<<<<< HEAD
import speech_recognition as sr
import pyttsx3 as speak
import re
import requests

speech_engine=speak.init()

def speaker(text):
    speech_engine.say(text)
    speech_engine.runAndWait()

def greet():
    speaker("Hello")

def input_voice():
    recognizer = sr.Recognizer()
    try:
        YOUR_DEVICE_INDEX = 1
        with sr.Microphone(device_index=YOUR_DEVICE_INDEX) as mic:
            recognizer.adjust_for_ambient_noise(mic, duration=1)
            print("Listening...")
            audio = recognizer.listen(mic, timeout=5, phrase_time_limit=5)
            input_audio = recognizer.recognize_google(audio)
            print(f"You said: {input_audio}") 
            speaker(input_audio)
            return input_audio.lower()

    except sr.WaitTimeoutError:
        speaker("I didn't hear anything. Please try again.")
        return ""
    except sr.UnknownValueError:
        speaker("Sorry, I did not understand what you said.")
        return ""
    except sr.RequestError:
        speaker("There seems to be an issue with my connection.")
        return ""
    except IndexError:
        speaker("The selected microphone index is not valid.")
        return ""

def parse_amount(amount_text):
    amount_text=amount_text.lower().strip()
    words=amount_text.split()

    multipliers={'thousand':1000 , 'lakh':100000 , 'crore':10000000}
    numerical_amount=0

    for word in words:
        try:
            numerical_amount=float(word)
            break
        except ValueError:
            continue

    if numerical_amount==0: return None

    for word in words:
        if word in multipliers:
            numerical_amount*=multipliers[word]
            break

    return int(numerical_amount)


def parse_payment(user_input):
    try:
        amount_pattern=r'([\d\.]+\s*(?:lakh|crore|thousand)?)'
        extracted_amount=re.search(amount_pattern,user_input,re.IGNORECASE)

        recipient_pattern = r'(?:to|for)\s+([a-zA-Z\s]+)'
        expected_recipient=re.search(recipient_pattern,user_input,re.IGNORECASE)
        if extracted_amount and expected_recipient:
            amount_text=extracted_amount.group(0)
            amount=parse_amount(amount_text)

            recipient=expected_recipient.group(1).title()

            return {"amount":amount,"recipient":recipient}
        else:
            return None

    except Exception as e:
        print(f"Error occured while parsing input")
        return None
    
def process_payment(payment_details):
    try:
        amount=payment_details["amount"]
        recipient=payment_details["recipient"]
        confirmation=f"just to confirm, should i pay {amount} rupees to {recipient}? "
        speaker(confirmation)

        print("Waiting for your confirmation (yes/no)")
        confirmed=input_voice().lower().strip()

        if "yes" in confirmed:
            url="http://127.0.0.1:5000/transaction"
            data={"recipient":recipient,"amount":amount}
            response=requests.post(url,json=data)

            if response.status_code==201:
                paid=f"Paid {amount} rupees to {recipient} successfully"
                print(paid)
                speaker(paid)

            else:
                error_msg=f"payment failed: {response.json().get('message','Unknown error')}"
                print(error_msg)
                speaker(error_msg)

        print("Payment Cancelled")
        speaker("Payment Cancelled")

        

    except Exception as e:
        print(f"An error occured during payment : {e}")
        return None


'''main function'''
if __name__ == "__main__":
    greet()
    user_input=input_voice()   

    if user_input:
        payment_details = parse_payment(user_input)
    
        if payment_details:
            print(f"Payment details : {payment_details}")
            process_payment(payment_details)
        else:
            print('Sorry I could not extract details from your request')
            speaker('Sorry I could not extract amount and recipient name from your request')
=======
import speech_recognition as sr
import pyttsx3 as speak
import re

speech_engine=speak.init()

def speaker(text):
    speech_engine.say(text)
    speech_engine.runAndWait()

def greet():
    speaker("Hello")

def input_voice():
    recognizer = sr.Recognizer()
    try:
        YOUR_DEVICE_INDEX = 1
        with sr.Microphone(device_index=YOUR_DEVICE_INDEX) as mic:
            recognizer.adjust_for_ambient_noise(mic, duration=1)
            print("Listening...")
            audio = recognizer.listen(mic, timeout=5, phrase_time_limit=5)
            input_audio = recognizer.recognize_google(audio)
            print(f"You said: {input_audio}") 
            speaker(input_audio)
            return input_audio.lower()

    except sr.WaitTimeoutError:
        speaker("I didn't hear anything. Please try again.")
        return ""
    except sr.UnknownValueError:
        speaker("Sorry, I did not understand what you said.")
        return ""
    except sr.RequestError:
        speaker("There seems to be an issue with my connection.")
        return ""
    except IndexError:
        speaker("The selected microphone index is not valid.")
        return ""

def parse_amount(amount_text):
    amount_text=amount_text.lower().strip()
    words=amount_text.split()

    multipliers={'thousand':1000 , 'lakh':100000 , 'crore':10000000}
    numerical_amount=0

    for word in words:
        try:
            numerical_amount=float(word)
            break
        except ValueError:
            continue

    if numerical_amount==0: return None

    for word in words:
        if word in multipliers:
            numerical_amount*=multipliers[word]
            break

    return int(numerical_amount)


def parse_payment(user_input):
    try:
        amount_pattern=r'([\d\.]+\s*(?:lakh|crore|thousand)?)'
        extracted_amount=re.search(amount_pattern,user_input,re.IGNORECASE)

        recipient_pattern = r'(?:to|for)\s+([a-zA-Z\s]+)'
        expected_recipient=re.search(recipient_pattern,user_input,re.IGNORECASE)
        if extracted_amount and expected_recipient:
            amount_text=extracted_amount.group(0)
            amount=parse_amount(amount_text)

            recipient=expected_recipient.group(1).title()

            return {"amount":amount,"recipient":recipient}
        else:
            return None

    except Exception as e:
        print(f"Error occured while parsing input")
        return None
    
def process_payment(payment_details):
    try:
        amount=payment_details["amount"]
        recipient=payment_details["recipient"]
        confirmation=f"just to confirm, should i pay {amount} rupees to {recipient}? "
        speaker(confirmation)

        print("Waiting for your confirmation (yes/no)")
        confirmed=input_voice().lower().strip()

        if "yes" in confirmed:
            paid=f"paid {amount} rupees to {recipient} successfully."
            print(paid)
            speaker(paid)

        elif confirmed:
            print("Payment Cancelled.")
            speaker("payment cancelled")

    except Exception as e:
        print(f"An error occured during payment : {e}")
        return None


'''main function'''
if __name__ == "__main__":
    greet()
    user_input=input_voice()   

    if user_input:
        payment_details = parse_payment(user_input)
    
        if payment_details:
            print(f"Payment details : {payment_details}")
            process_payment(payment_details)
        else:
            print('Sorry I could not extract details from your request')
            speaker('Sorry I could not extract amount and recipient name from your request')
>>>>>>> b197bf2c8c4020dbe494059126457761f5446243
    