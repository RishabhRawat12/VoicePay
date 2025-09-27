import re

# Map words to multipliers
NUMBER_WORDS = {
    'thousand': 1_000,
    'lakh': 100_000,
    'crore': 10_000_000
}

def words_to_number(words):
    total = 0
    current = 0
    for w in words:
        if w.isdigit():
            current += int(w)
        elif w in NUMBER_WORDS:
            if current == 0:
                current = 1
            current *= NUMBER_WORDS[w]
            total += current
            current = 0
    total += current
    return total if total != 0 else None

def parse_payment_details(text):
    text = text.lower()
    amount = None
    digit_with_word = re.search(r'(\d+(?:\.\d+)?)\s*(thousand|lakh|crore)?', text)
    if digit_with_word:
        number = float(digit_with_word.group(1))
        multiplier_word = digit_with_word.group(2)
        if multiplier_word in NUMBER_WORDS:
            number *= NUMBER_WORDS[multiplier_word]
        amount = number
    else:
        words = text.split()
        number_words = [w for w in words if w.isdigit() or w in NUMBER_WORDS]
        amount = words_to_number(number_words)

    recipient_match = re.search(r'to\s+([A-Za-z]+)', text)
    recipient = recipient_match.group(1).capitalize() if recipient_match else None

    if amount and recipient:
        return {'amount': amount, 'recipient': recipient}
    return None
import re

# Map words to multipliers
NUMBER_WORDS = {
    'thousand': 1_000,
    'lakh': 100_000,
    'crore': 10_000_000
}

def words_to_number(words):
    total = 0
    current = 0
    for w in words:
        if w.isdigit():
            current += int(w)
        elif w in NUMBER_WORDS:
            if current == 0:
                current = 1
            current *= NUMBER_WORDS[w]
            total += current
            current = 0
    total += current
    return total if total != 0 else None

def parse_payment_details(text):
    text = text.lower()
    amount = None
    digit_with_word = re.search(r'(\d+(?:\.\d+)?)\s*(thousand|lakh|crore)?', text)
    if digit_with_word:
        number = float(digit_with_word.group(1))
        multiplier_word = digit_with_word.group(2)
        if multiplier_word in NUMBER_WORDS:
            number *= NUMBER_WORDS[multiplier_word]
        amount = number
    else:
        words = text.split()
        number_words = [w for w in words if w.isdigit() or w in NUMBER_WORDS]
        amount = words_to_number(number_words)

    recipient_match = re.search(r'to\s+([A-Za-z]+)', text)
    recipient = recipient_match.group(1).capitalize() if recipient_match else None

    if amount and recipient:
        return {'amount': amount, 'recipient': recipient}
    return None
