using Microsoft.EntityFrameworkCore;
using Store.Data.DataEntities;
using Store.Data.Infrastructure;
using Store.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Store.Data.Repositories
{
    public class BaseRepository<T> : Disposable, IBaseRepository<T> where T : class, IEntityBase
    {
        private StoreContext _storeContext;
        public BaseRepository(StoreContext storeContext)
        {
            _storeContext = storeContext;
        }
        

        public virtual IQueryable<T> GetAll()
        {
            return _storeContext.Set<T>();
        }

        public virtual void Delete(T item)
        {
            _storeContext.Set<T>().Remove(item);
        }

        public virtual void Add(T item)
        {
          _storeContext.Set<T>().Add(item);
        }

        public T GetSingle(int id)
        {
           return _storeContext.Set<T>().FirstOrDefault(x => x.ID == id);
        }

        public virtual void Edit(T entity)
        {
            var dbEntityEntry = _storeContext.Entry<T>(entity);
            dbEntityEntry.State = EntityState.Modified;
        }

        public virtual bool Commit()
        {
            try
            {
                return _storeContext.SaveChanges() > 0;
            }
            catch (Exception exc)
            {
                return false;
            }
        }



        public virtual IQueryable<T> GetNumOfItemsWithInclude(string propName)
        {
            return _storeContext.Set<T>().Include(propName);
        }

        public virtual IQueryable<T> GetNumOfItemsWithParams(string propName, int numToTake, int numToSkip)
        {
            return _storeContext.Set<T>().Skip(numToSkip).Take(numToTake).Include(propName);
        }
    }
}
