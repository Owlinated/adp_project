using System;
using System.Collections.Generic;
using System.Linq;
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
        public Equation(string serialized, IList<RestEquationParam> parameters = null, IList<Equation> references = null)
        {
            EquationString = serialized;
            Parameters = parameters ?? new List<RestEquationParam>();
            References = references ?? new List<Equation>();
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
        /// Gets all referenced equations.
        /// </summary>
        public IList<Equation> References { get; }

        /// <summary>
        /// Determine the equations value
        /// </summary>
        public double Evaluate(Dictionary<int, Dictionary<int, double>> parameterValues = null)
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
                switch (name.ToLower())
                {
                    case "var":
                        EvaluateVar(args);
                        break;
                    case "ref":
                        EvaluateRef(args);
                        break;
                }
            }

            void EvaluateVar(FunctionArgs args)
            {
                var index = (int)args.Parameters[0].Evaluate();
                var param = Parameters[index];

                if (parameterValues != null &&
                    parameterValues.TryGetValue(Id, out var parameters) &&
                    parameters.TryGetValue(index, out var result))
                {
                    args.Result = result;
                    return;
                }

                args.Result = Convert.ToDouble(param.Default);
            }

            void EvaluateRef(FunctionArgs args)
            {
                var index = (int)args.Parameters[0].Evaluate();
                var reference = References.FirstOrDefault(equation => equation.Id == index);
                if (reference != null)
                {
                    args.Result = reference.Evaluate(parameterValues);
                }
            }
        }

        /// <summary>
        /// Convert the contained equation into a string.
        /// </summary>
        public string Serialize()
        {
            return EquationString;
        }
    }
}
