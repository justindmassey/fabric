# fabric

A tiny REPL for defining and combining named sets.

## overview

fabric is a small interactive language for working with sets.

It supports:

* named sets
* union, intersection, difference, symmetric difference, and product
* nested set literals
* grouping with braces
* canonicalized structural equality
* set insertion vs set expansion

---

## usage

Run:

```bash
node fabric.js
```

You’ll see:

```text
{}
```

---

## syntax

### assignment

```text
name: expression
```

Example:

```text
A: a b c
B: c d
```

---

### deletion

```text
!name
```

Example:

```text
!A
```

---

### evaluation

Any non-empty line without `:` or `!` is evaluated and printed:

```text
a b + b c
```

---

### print all sets

Press enter on an empty line.

---

## elements and splitting

fabric has two splitting modes.

### whitespace mode

If an expression contains no commas at the current level, it is split by whitespace:

```text
a b c
```

means:

```text
{ a, b, c }
```

So:

```text
red apple green
```

means three atoms:

* `red`
* `apple`
* `green`

---

### comma mode

If an expression contains a comma at the current level, it is split by commas instead:

```text
red apple, green pear, banana
```

means:

```text
{ red apple, green pear, banana }
```

So in comma mode, spaces stay inside the atom.

---

### braces also separate elements

Braces act as separators at the top level:

```text
{ a b }c
```

means:

```text
{ { a, b }, c }
```

```text
a{ b c }
```

means:

```text
{ a, { b, c } }
```

```text
{ a }{ b }
```

means:

```text
{ { a }, { b } }
```

---

## set references

```text
$name   insert the set itself as an element
$$name  insert the elements of the set
```

Example:

```text
A: a b
B: $$A c
C: $A
```

Result:

```text
A = { a, b }
B = { a, b, c }
C = { { a, b } }
```

Important:

* `A` is the literal atom `A`
* `$A` is the set `A` as one element
* `$$A` is the elements of set `A`

---

## set literals and grouping

Braces do two jobs.

### set literal (inside expressions)

Inside a larger expression, `{ ... }` creates a set value:

```text
X: { a b } c
```

Result:

```text
X = { { a, b }, c }
```

---

### grouping (when wrapping the whole expression)

If the whole expression is wrapped, braces act as grouping:

```text
{ a b + b c }
```

Result:

```text
{ a, b, c }
```

```text
{ a b + b c } & b c
```

Result:

```text
{ b, c }
```

---

## operators

```text
+   union
&   intersection
-   difference
|   symmetric difference
*   cartesian product
```

---

## operator examples (atoms)

### union

```text
a b + b c
```

→

```text
{ a, b, c }
```

---

### intersection

```text
a b & b c
```

→

```text
{ b }
```

---

### difference

```text
a b c - b c
```

→

```text
{ a }
```

---

### symmetric difference

```text
a b c | b c d
```

→

```text
{ a, d }
```

---

### cartesian product

```text
a b * x y
```

→

```text
{ { a, x }, { a, y }, { b, x }, { b, y } }
```

Note: pairs are unordered sets.

---

## named set examples

```text
A: a b c
B: c d

$$A + $$B
{ a, b, c, d }

$$A & $$B
{ c }

$$A - $$B
{ a, b }

$$A | $$B
{ a, b, d }

$$A * $$B
{ { a, c }, { a, d }, { b, c }, { b, d }, { c, c }, { c, d } }
```

---

## behavior

### canonical sets

```text
A: a b
B: b a
C: $A $B
```

→

```text
A = { a, b }
B = { a, b }
C = { { a, b } }
```

---

### nested sets

```text
X: { a b } { c d }
```

→

```text
X = { { a, b }, { c, d } }
```

---

### insertion vs expansion

```text
A: a b
```

```text
$A   → { { a, b } }
$$A  → { a, b }
```

---

### parsing

* recursive evaluation
* no precedence
* right-associative

```text
a b - b - c
```

→

```text
a b - (b - c)
```

Use braces for grouping:

```text
{ a b - b } - c
```

---

## example session

```text
A: red apple, green pear
B: green pear, banana

$$A + $$B
{ banana, green pear, red apple }

$$A & $$B
{ green pear }

X: { $$A + $$B } kiwi
Y: { a b }{ c d }

<empty line>

A = { green pear, red apple }
B = { banana, green pear }
X = { kiwi, { banana, green pear, red apple } }
Y = { { a, b }, { c, d } }
```

---

## notes

* plain identifiers (like `A`) are literal atoms
* use `$$A` for elements
* use `$A` for the set as one element
* elements can be strings or sets
* undefined set references are ignored
* empty elements are ignored
* product creates pair-sets
* named sets print only on empty input

---

## why

Small language.
Immediate feedback.
Just sets.
