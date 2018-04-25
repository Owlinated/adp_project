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

For the equation part we allow the following tokens:

 - operations: + - * /
 - expressions: Sin() Cos()
 - features: ( )
 - variables: Var(0)

Variables are indexed by their position in the list.