using SpaceY.Core.EquationTerms;

namespace SpaceY.Core
{
	/// <summary>
	/// Container for a mathematical expression.
	/// Parses, evaluates, and serializes equations.
	/// </summary>
	public class Equation
	{
		public int Id { get; }

		private IEquationTerm Term;

		/// <summary>
		/// Create an equation by parsing its <paramref name="serialized"/> form.
		/// </summary>
		public Equation(int id, string serialized)
		{
			Id = id;

			// This only creates a dummy equation
			var oneTerm = new ConstantTerm(1);
			Term = new AdditionTerm(new [] {oneTerm, oneTerm});
		}

		/// <summary>
		/// Determine the equations value
		/// </summary>
		public float Evaluate()
		{
			return Term.Evaluate();
		}

		/// <summary>
		/// Convert the contained equation into a string.
		/// </summary>
		public string Serialize()
		{
			return "f() = " + Term.Serialize();
		}
	}
}
