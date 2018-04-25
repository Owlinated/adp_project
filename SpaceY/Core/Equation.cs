using System;
using System.Collections.Generic;
using NCalc;
using SpaceY.Interface;

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
        public Equation(int id, string serialized, IList<RestEquationParam> parameters = null)
        {
            // This only creates a dummy equation
            Id = id;
            EquationString = serialized;
            Parameters = parameters ?? new List<RestEquationParam>();
            Expression = new Expression(serialized);
            Expression.EvaluateFunction += EvaluateFunction;
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
        /// Gets the parameters used for evaluation.
        /// </summary>
        public IList<RestEquationParam> Parameters { get; }

        /// <summary>
        /// Gets the expression which describers the equation.
        /// </summary>
        public Expression Expression { get; }

        /// <summary>
        /// Create an equation from the interface type
        /// </summary>
        public static Equation Create(int id, RestEquation equation)
        {
            return new Equation(id, equation.Equation, equation.Parameters);
        }

        /// <summary>
        /// Determine the equations value
        /// </summary>
        public decimal Evaluate()
        {
            return Convert.ToDecimal(Expression.Evaluate());
        }

        /// <summary>
        /// Convert the contained equation into a string.
        /// </summary>
        public string Serialize()
        {
            return "f() = " + EquationString;
        }

        private void EvaluateFunction(string name, FunctionArgs args)
        {
            if (name != "var")
            {
                return;
            }

            var index = (int)args.Parameters[0].Evaluate();
            var param = Parameters[index];
            args.Result = param.Value ?? param.Default;
        }
    }
}
