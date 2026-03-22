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

## quick example

```
A: a b c
B: c d

$$A + $$B
{
  a,
  b,
  c,
  d
}

$$A & $$B
{
  c
}

C: { $$A + $$B } x

C:
  {
    {
      a,
      b,
      c,
      d
    },
    x
  }
```

---

## the key idea

There are three levels:

```
A     → the atom "A"
$A    → the set A as one element
$$A   → the elements of A
```

Example:

```
A: a b

$A
{
  {
    a,
    b
  }
}

$$A
{
  a,
  b
}
```

---

## operators

```
+   union
&   intersection
-   difference
|   symmetric difference
*   product
```

Example:

```
a b * x y
{
  {
    a,
    x
  },
  {
    a,
    y
  },
  {
    b,
    x
  },
  {
    b,
    y
  }
}
```

---

## set literals and grouping

Braces do two things.

### nested sets

```
X: { a b } c

X:
  {
    {
      a,
      b
    },
    c
  }
```

### grouping

```
{ a b + b c } & b c

{
  b,
  c
}
```

---

## splitting rules

fabric has two modes.

### whitespace mode

```
a b c
```

→

```
{
  a,
  b,
  c
}
```

### comma mode (for multi-word atoms)

```
red apple, green pear
```

→

```
{
  red apple,
  green pear
}
```

### braces also separate elements

```
{ a b }c
```

→

```
{
  {
    a,
    b
  },
  c
}
```

```
a{ b c }
```

→

```
{
  a,
  {
    b,
    c
  }
}
```

---

## more examples

```
A: red apple, green pear
B: green pear, banana

$$A | $$B
{
  red apple,
  banana
}

Y: { a b }{ c d }

Y:
  {
    {
      a,
      b
    },
    {
      c,
      d
    }
  }
```

---

## behavior

### canonical sets

```
A: a b
B: b a
C: $A $B
```

```
A:
  {
    a,
    b
  }

B:
  {
    a,
    b
  }

C:
  {
    {
      a,
      b
    }
  }
```

---

## parsing

* recursive evaluation
* no precedence rules
* right-associative behavior
* use `{ ... }` for grouping

Example:

```
a b - b - c
```

is:

```
a b - (b - c)
```

---

## notes

* sets are canonical (order does not matter)
* elements can be strings or sets
* `$` vs `$$` is explicit by design
* product creates unordered pairs
* output is formatted as an indented tree
* named sets print on empty input

---

## why

Small language.
Immediate feedback.
Just sets.
