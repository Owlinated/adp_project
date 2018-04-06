using System.Collections.Generic;
using System.Linq;

namespace SpaceY.Core.EquationTerms
{
	/// <summary>
	/// A term that adds up values of other terms.
	/// </summary>
	public class AdditionTerm : IEquationTerm
	{
		private ICollection<IEquationTerm> Terms { get; }

		public AdditionTerm(ICollection<IEquationTerm> terms)
		{
			Terms = terms;
		}

		/// <inheritdoc />
		public float Evaluate()
		{
			return Terms.Aggregate(0f, (sum, expression) => sum + expression.Evaluate());
		}

		/// <inheritdoc />
		public string Serialize()
		{
			var serializedTerms = Terms.Select(term => term.Serialize());
			return $"({string.Join(" + ", serializedTerms)})";
		}
	}
}