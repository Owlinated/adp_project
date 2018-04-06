namespace SpaceY.Core.EquationTerms
{
	/// <summary>
	/// Interface for terms, which make up equations.
	/// </summary>
	public interface IEquationTerm
	{
		/// <summary>
		/// Determine the terms value.
		/// </summary>
		float Evaluate();

		/// <summary>
		/// Serialize the term into a string
		/// </summary>
		string Serialize();
	}
}
