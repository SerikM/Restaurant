using System;
using System.Linq;
using Store.Data.DataEntities;

namespace Store.Data.Interfaces
{
    public interface IBaseRepository<T> : IDisposable where T : class, IEntityBase
    {
        IQueryable<T> GetAll();
        void Add(T entity);
        bool Commit();
        void Delete(T entity);
        T GetSingle(int id);
        void Edit(T entity);
        IQueryable<T> GetNumOfItemsWithInclude(string propertyName);
        IQueryable<T> GetNumOfItemsWithParams(string propName, int numToTake, int numToSkip);

    }
}

