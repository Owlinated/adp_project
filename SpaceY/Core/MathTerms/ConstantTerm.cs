using System.Globalization;

namespace SpaceY.Core.EquationTerms
{
	/// <summary>
	/// A term of constant value.
	/// </summary>
	public class ConstantTerm : IEquationTerm
	{
		private float Value { get; }

		public ConstantTerm(float value)
		{
			Value = value;
		}
		
		/// <inheritdoc />
		public float Evaluate()
		{
			return Value;
		}

		/// <inheritdoc />
		public string Serialize()
		{
			return Value.ToString(CultureInfo.InvariantCulture);
		}
	}
}
