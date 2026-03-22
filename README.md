# fabric

A tiny REPL for working with named sets.

---

## idea

fabric is a small language for set algebra.

* define sets
* combine them
* nest them
* explore them interactively

---

## usage

Run:

```bash
node fabric
```

You’ll see:

```text
{}
```

---

## assignment

Use `name: expression` to assign a set.

```text
A: a b c
B: c d
```

Result:

```text
A = { a, b, c }
B = { c, d }
```

---

## deletion

```text
!A
```

---

## evaluation

Any non-empty line that is not an assignment or deletion is evaluated:

```text
a b + b c
```

→

```text
{ a, b, c }
```

---

## the key idea

There are three levels:

```text
A     → the atom "A"
$A    → the set A as one element
$$A   → the elements of A
```

Example:

```text
A: a b
```

```text
$A
```

→

```text
{ { a, b } }
```

```text
$$A
```

→

```text
{ a, b }
```

---

## operators

```text
+   union
&   intersection
-   difference
|   symmetric difference
*   product
```

---

## operator examples

```text
a b + b c
→ { a, b, c }

a b & b c
→ { b }

a b c - b c
→ { a }

a b c | b c d
→ { a, d }
```

---

## cartesian product

The product operator `*` produces ordered pairs encoded as sets.

Each pair `(a, b)` is represented as:

```text
{ { a }, { a, b } }
```

Example:

```text
a b * x y
```

→

```text
{
  { { a }, { a, x } },
  { { a }, { a, y } },
  { { b }, { b, x } },
  { { b }, { b, y } }
}
```

---

## using named sets

```text
A: a b c
B: c d
```

```text
$$A + $$B
→ { a, b, c, d }

$$A & $$B
→ { c }

$$A - $$B
→ { a, b }

$$A | $$B
→ { a, b, d }
```

---

## set literals and grouping

Braces do two things.

### nested sets

```text
X: { a b } c
```

→

```text
X = { { a, b }, c }
```

---

### grouping

```text
{ a b + b c } & b c
```

→

```text
{ b, c }
```

---

## splitting rules

fabric has two modes.

### whitespace mode

```text
a b c
→ { a, b, c }
```

---

### comma mode

```text
red apple, green pear
→ { red apple, green pear }
```

---

### braces also separate elements

```text
{ a b }c
→ { { a, b }, c }

a{ b c }
→ { a, { b, c } }
```

---

## more examples

```text
A: red apple, green pear
B: green pear, banana

$$A | $$B
→ { red apple, banana }

Y: { a b }{ c d }
→ { { a, b }, { c, d } }
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

## parsing

* recursive evaluation
* no precedence rules
* right-associative behavior
* use `{ ... }` for grouping

---

## notes

* tab completion is supported
* sets are canonical (order does not matter)
* elements can be strings or sets
* `$` vs `$$` is explicit by design
* product encodes ordered pairs using nested sets
* named sets print on empty input
* named sets are displayed as `name = value`