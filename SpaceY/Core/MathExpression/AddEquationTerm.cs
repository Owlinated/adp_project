using System.Collections.Generic;
using System.Linq;

namespace SpaceY.Coffee.MathExpression
{
	public class AddEquationTerm : IEquationTerm
	{
		private ICollection<IEquationTerm> Terms { get; }

		public AddEquationTerm(ICollection<IEquationTerm> terms)
		{
			Terms = terms;
		}

		public float Evaluate()
		{
			return Terms.Aggregate(0f, (sum, expression) => sum + expression.Evaluate());
		}

		public string Serialize()
		{
			var serializedTerms = Terms.Select(term => term.Serialize());
			return $"({string.Join(" + ", serializedTerms)})";
		}
	}
}