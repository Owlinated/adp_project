# Equation Data Structure
We are going to use this structure to send equations between client and server.

```javascript
{
    "equation": "1+1*3+var(g)",
    "description": "Calculates accelation of spacecraft",
    "parameters": [
        {
            "name": "g",
            "description": "Gravitiational force",
            "default": 0
        },
        {
            "name": "y",
            "description": "Dummy variable",
            "default": 3.14
        }
    ]
}
```

For equations which contain other equations we use this structure which unwraps recursive references into one flat list, where "Equation Data Structure" is the structure described above.

```javascript
{
    "main": "Equation Data Structure"
    "references": [
        "Equation Data Structure",
        "Equation Data Structure"
    ]
}
```

Parameters are sent as key value pairs, where the key is the parameters name, and the value its current value.
For equations that reference other these key value pairs are grouped by equation ids. Note that parameters are only valid for their equation; the two "x" are different parameters for different equations.

```javascript
{
    0: {
        "x": undefined,
        "g": 9.81
    },
    3: {
        "x": 3
    }
}
```

For the equation part we allow the following tokens:

 - Operations: + - * /
 - Expressions: Sin() Cos()
 - Features: ( )
 - Variables: Var(0)
 - Equation references: Ref(0)

Variables are indexed by their position in the list.
References refer to equation ids.