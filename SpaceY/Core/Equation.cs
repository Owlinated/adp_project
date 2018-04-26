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
        public Equation(string serialized, IList<RestEquationParam> parameters = null)
        {
            EquationString = serialized;
            Parameters = parameters ?? new List<RestEquationParam>();
            Expression = new Expression(serialized);
        }

        /// <summary>
        /// Gets or sets the equation's identifier.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the equation's string representation.
        /// </summary>
        public string EquationString { get; set; }

        /// <summary>
        /// Gets or sets the parameters used for evaluation.
        /// </summary>
        public IList<RestEquationParam> Parameters { get; set; }

        /// <summary>
        /// Gets the expression which describers the equation.
        /// </summary>
        public Expression Expression { get; }

        /// <summary>
        /// Create an equation from the interface type
        /// </summary>
        public static Equation Create(RestEquation equation)
        {
            return new Equation(equation.Equation, equation.Parameters);
        }

        /// <summary>
        /// Determine the equations value
        /// </summary>
        public double Evaluate(double[] parameterValues = null)
        {
            try
            {
                Expression.EvaluateFunction += EvaluateFunction;
                return Convert.ToDouble(Expression.Evaluate());
            }
            finally
            {
                Expression.EvaluateFunction -= EvaluateFunction;
            }

            void EvaluateFunction(string name, FunctionArgs args)
            {
                if (name != "var")
                {
                    return;
                }

                var index = (int)args.Parameters[0].Evaluate();
                var param = Parameters[index];

                if (parameterValues?.Length > index)
                {
                    args.Result = Convert.ToDouble(parameterValues[index]);
                    return;
                }

                args.Result = Convert.ToDouble(param.Default);
            }
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
