using NCalc;

namespace SpaceY.Core
{
	/// <summary>
	/// Container for a mathematical expression.
	/// Parses, evaluates, and serializes equations.
	/// </summary>
	public class Equation
	{
		public int Id { get; }
        public string equationString { get; }
        public Expression e { get; }

		/// <summary>
		/// Create an equation by parsing its <paramref name="serialized"/> form.
		/// </summary>
		public Equation(int id, string serialized)
		{

			// This only creates a dummy equation
            Id = id;
            equationString = serialized;
            e = new Expression(serialized);

		}

		/// <summary>
		/// Determine the equations value
		/// </summary>
		public object Evaluate()
		{
			return e.Evaluate();
		}

		/// <summary>
		/// Convert the contained equation into a string.
		/// </summary>
		public string Serialize()
		{
			return "f() = " + equationString;
		}
	}
}
