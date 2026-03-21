# fabric

A tiny REPL for defining and combining named sets.

## overview

fabric is a small interactive language for working with sets.

It supports:

* named sets
* union, intersection, difference, symmetric difference, and product
* nested sets
* canonicalized structural equality
* set insertion vs set expansion

---

## usage

Run:

```bash
cd fabric
node .
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
$$A + $$B
```

---

### print all sets

Press enter on an empty line.

---

## elements

Elements are split by whitespace or commas:

```text
a b c
a, b, c
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

### union

```text
$$A + $$B
```

---

### intersection

```text
$$A & $$B
```

---

### difference

```text
$$A - $$B
```

---

### symmetric difference

```text
$$A | $$B
```

Elements in either set, but not both.

---

### cartesian product

```text
$$A * $$B
```

Example:

```text
A: a b
B: x y

$$A * $$B
```

Result:

```text
{ { a, x }, { a, y }, { b, x }, { b, y } }
```

Note: pairs are unordered sets, not tuples.
`{ a, x }` is the same as `{ x, a }`.

---

## behavior

### canonical sets

Sets are canonicalized by structure:

```text
A: a b
B: b a
C: $A $B
```

Result:

```text
A = { a, b }
B = { a, b }
C = { { a, b } }
```

---

### nested sets

```text
A: a b
B: $A
```

Result:

```text
B = { { a, b } }
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
* no operator precedence
* right-associative

```text
$$A - $$B - $$C
```

is parsed as:

```text
$$A - ($$B - $$C)
```

---

### reserved braces

`{` and `}` are currently ignored and reserved for future syntax.

```text
A: { a b }
```

is the same as:

```text
A: a b
```

---

## example session

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

C: $$A $$B
D: $A $B

$$A * $$B
{ { a, c }, { a, d }, { b, c }, { b, d }, { c, c }, { c, d } }

<empty line>

A = { a, b, c }
B = { c, d }
C = { a, b, c, d }
D = { { a, b, c }, { c, d } }
```

---

## notes

* plain identifiers (like `A`) are literal atoms
* use `$$A` to work with elements of a set
* use `$A` to insert a set as a single element
* elements are strings or sets
* undefined set references are ignored
* empty elements are ignored
* product creates pair-sets
* braces are reserved but not yet meaningful
* named sets print only on empty input

---

## why

Small language.
Immediate feedback.
Just sets.
