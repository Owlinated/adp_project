using NCalc;

namespace SpaceY.Core
{
    /// <summary>
    /// Container for a mathematical expression.
    /// Parses, evaluates, and serializes equations.
    /// </summary>
    public class Equation
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Equation"/> class.
        /// Parses the expression from the serialized version.
        /// </summary>
        public Equation(int id, string serialized)
        {
            // This only creates a dummy equation
            Id = id;
            EquationString = serialized;
            Expression = new Expression(serialized);
        }

        /// <summary>
        /// Gets the equation's identifier.
        /// </summary>
        public int Id { get; }

        /// <summary>
        /// Gets the equation's string representation.
        /// </summary>
        public string EquationString { get; }

        /// <summary>
        /// Gets the expression which describers the equation.
        /// </summary>
        public Expression Expression { get; }

        /// <summary>
        /// Determine the equations value
        /// </summary>
        public object Evaluate()
        {
            return Expression.Evaluate();
        }

        /// <summary>
        /// Convert the contained equation into a string.
        /// </summary>
        public string Serialize()
        {
            return "f() = " + EquationString;
        }
    }
}
