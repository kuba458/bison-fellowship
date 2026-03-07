# /bison-outreach — Masowy outreach Bison Fellowship przez Klaudiusz

Tworzysz spersonalizowane szkice maili outreachowych w systemie Klaudiusz (dashboard na localhost:3000) dla listy kontaktów. Wiadomość jest od dr Macieja Kaweckiego i zachowuje jego charakterystyczny, osobisty styl — pełen pasji, bezpośredni, z powołaniem się na konkretne nazwiska i osiągnięcia.

---

## KROK 1: INPUT — Zapytaj użytkownika

Potrzebujesz:

1. **CSV z kontaktami** — kolumny: imię, nazwisko, email (użytkownik wklei lub poda ścieżkę do pliku)
2. **Firma/kontekst** (opcjonalnie) — jeśli wszyscy kontakty są z jednej firmy, podaj nazwę. Jeśli CSV zawiera kolumnę "firma", użyj jej per-kontakt.
3. **Czy istnieje deck dla tej firmy?** — sprawdź `ls clients/ | grep -i [slug]`. Jeśli tak, `deck_url` = `/decks/[slug]/index.html`.

---

## KROK 2: SZABLON WIADOMOŚCI

Bazuj na tym wzorcu stylistycznym Macieja. To jest jego autentyczny głos — zachowaj:
- Formalny, ale ciepły zwrot: "Szanowny Panie [Imię]," / "Szanowna Pani [Imię],"
- Pasję i osobiste zaangażowanie ("mój najważniejszy projekt", "chcę dać")
- Konkretne nazwiska i instytucje (OpenAI, Harvard, Cambridge, Oxford, Oracle)
- Strukturę: wizja → co robimy → kto jest → co partner zyskuje → zaproszenie
- Brak korporacyjnego żargonu — to pisze człowiek, nie firma

### WZORZEC (adaptuj, nie kopiuj 1:1 — każdy mail powinien brzmieć naturalnie):

```
Szanowny Panie [Imię] / Szanowna Pani [Imię],

wykorzystując zgromadzoną latami sieć naszych kontaktów na całym świecie, chcemy dać polskiej uzdolnionej młodzieży największy istniejący do tej pory program mentoringowy. Damy go. To dziś mój najważniejszy projekt.

Program przygotowywany od 1,5 roku, w którym młodzi ludzie dotkną największych umysłów na świecie. Swój udział potwierdzili naukowcy OpenAI, wiceprezes Oracle, naukowcy Harvardu, Cambridge, Oxfordu. Nieodpłatny. Otwarty.

Tworzymy 8-tygodniowy program stypendialny Bison Fellowship dla 15 najwybitniejszych polskich olimpijczyków i studentów ukierunkowanych na sztuczną inteligencję i innowacje, który będziemy kilka razy do roku powtarzać. Nazwa inspirowana jest miejscem mojego domu — Puszczą Białowieską.

Naszą misją jest wspieranie młodych polskich talentów, również z myślą o tym, aby zostali oni w Polsce i to tu budowali swoje rozwiązania. To naprawdę pierwszy program, w którym mentorami są naukowcy Harvardu, Oxfordu, Cambridge, MIT i innych czołowych uczelni świata.

Najważniejszym elementem programu jest rozwiązywanie przez olimpijczyków z wykorzystaniem AI wyzwań technologicznych zaproponowanych przez partnerów. Spośród setek zgłoszeń w pierwszym etapie wytypujemy 15 najzdolniejszych. Następnie pięć grup po 3 osoby każda, pod nadzorem najlepszych mentorów, będą pracować nad rozwiązaniem problemu partnera. Każdy z partnerów będzie mógł wykorzystać rozwiązanie w swojej działalności biznesowej. Jestem przekonany, że ten zespół pod nadzorem takich mentorów ten problem po prostu rozwiąże.

W Radzie Programowej znajdzie się Rafał Brzoska, Jolanta Kwaśniewska i wiele innych nazwisk. Pierwsze wydarzenie w ramach programu organizujemy 23 marca 2026 w Rotundzie PKO z udziałem powyższych osób. Po trzech miesiącach spośród 5 drużyn wyłonimy 2 najlepsze, których uczestników zabieram na summer school do Doliny Krzemowej, dzieląc się z nimi wszystkimi swoimi kontaktami tutaj.

Mając już wszystko — zespół, stronę, mentorów, Radę Programową, pierwszych partnerów — każdy partner zostanie włączony w cały ogromny pakiet komunikacyjny, wykorzystując też moje osobiste, obserwowane przez kilka milionów Polaków kanały komunikacji.

W załączeniu przesyłam prezentację z detalami programu.

Pozdrawiam serdecznie,
Maciej Kawecki
```

### ZASADY PERSONALIZACJI:

1. **Zwrot grzecznościowy** — zawsze formalny: "Szanowny Panie [Imię w wołaczu]," dla mężczyzn, "Szanowna Pani [Imię w wołaczu]," dla kobiet (np. "Szanowny Panie Piotrze,", "Szanowna Pani Anno,")
2. **Opcjonalnie** — jeśli znasz firmę kontaktu, dodaj 1-2 zdania dlaczego akurat ta firma pasuje do programu (np. "Wierzę, że [Firma] z jej doświadczeniem w [obszar] byłaby idealnym partnerem do zdefiniowania wyzwania dla naszych stypendystów.")
3. **Temat maila**: `Bison Fellowship — zaproszenie do współpracy` lub wariant z nazwą firmy: `Bison Fellowship × [Firma] — zaproszenie`
4. **Nie zmieniaj** tonu, struktury ani kluczowych faktów (mentorzy, daty, format programu)
5. **Zdanie o załączniku** — dodaj tylko jeśli draft będzie miał `deck_url` (= istnieje deck dla firmy)

---

## KROK 3: TWORZENIE DRAFTÓW W KLAUDIUSZU

Dla każdego kontaktu z CSV wyślij request:

```bash
curl -s -X POST http://localhost:3000/api/drafts \
  -H 'Content-Type: application/json' \
  -d '{
    "company": "[Firma lub 'Outreach']",
    "contact_name": "[Imię Nazwisko]",
    "contact_email": "[email]",
    "from_email": "maciej.kawecki@thisisit.edu.pl",
    "subject": "[Temat]",
    "body_html": "[HTML wiadomości]",
    "channel": "email",
    "deck_url": "[/decks/slug/index.html lub null]"
  }'
```

### FORMAT HTML:
- Używaj `<p>` dla akapitów
- Zachowaj podpis z sygnaturką Macieja (Gmail-style):
```html
<p style="margin-top:24px;">Pozdrawiam serdecznie,</p>
<p style="margin:0;">--</p>
<table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #1a1a1a; margin-top: 8px;">
  <tr>
    <td style="padding-right: 18px; vertical-align: middle;">
      <img src="https://ci3.googleusercontent.com/mail-sig/AIorK4y6empd9rohQvDgVdqA7HVEvDjNMZAXYDhUb97HS5YTJbwdGAuz3bZBLvmNorDlTZtlrUUh_chE7ty1" alt="This is World" width="100" style="display:block;">
    </td>
    <td style="padding-left: 18px; border-left: 1px solid #ccc; vertical-align: top; line-height: 1.5;">
      <strong style="font-size: 14px;">Dr Maciej Kawecki</strong><br>
      <span style="color: #555;">CEO, Co-Founder | <a href="https://thisisit.edu.pl" style="color: #1a73e8; text-decoration: none;">This is World LLC</a></span><br>
      <span style="color: #555;">M: <a href="tel:+48505656554" style="color: #1a73e8; text-decoration: none;">+48 505 656 554</a></span><br>
      <span style="color: #555;">E: <a href="mailto:maciej.kawecki@thisisit.edu.pl" style="color: #1a73e8; text-decoration: none;">maciej.kawecki@thisisit.edu.pl</a></span><br>
      <span style="color: #555;">2479 E Bayshore Rd, Palo Alto, CA 94303</span>
    </td>
  </tr>
</table>
```

---

## KROK 4: PODSUMOWANIE

Po utworzeniu wszystkich draftów wypisz:

```
═══════════════════════════════════════════
  OUTREACH GOTOWY: [N] draftów w Klaudiuszu
═══════════════════════════════════════════

Kontakty:
  1. [Imię Nazwisko] <[email]> — [Firma] — deck: [tak/nie]
  2. ...

Następne kroki:
  → Otwórz http://localhost:3000
  → Przejrzyj i edytuj drafty
  → Kliknij "Wyślij" przy każdym (PDF załączy się automatycznie jeśli deck istnieje)
```

---

## NOTATKI

- Klaudiusz API: `http://localhost:3000/api/drafts` (POST)
- Decks: `clients/[slug]/index.html` — sprawdź `ls clients/` przed ustawieniem deck_url
- PDF załącznik: system Klaudiusz automatycznie dołącza `clients/[slug]/deck.pdf` przy wysyłce jeśli `deck_url` jest ustawiony
- Zwrot grzecznościowy — zawsze formalny: "Szanowny Panie Piotrze," / "Szanowna Pani Anno,". Imię w wołaczu.
- Jeśli CSV nie ma kolumny "firma", ustaw company na "Outreach" i nie personalizuj pod firmę
