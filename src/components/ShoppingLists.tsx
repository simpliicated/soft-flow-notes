import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Star, 
  Package,
  Coffee,
  Home,
  Heart,
  X
} from 'lucide-react';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
  price?: number;
  notes?: string;
  category: string;
}

interface ShoppingList {
  id: string;
  name: string;
  type: 'daily' | 'wishlist';
  items: ShoppingItem[];
  category: string;
}

const categories = [
  { id: 'groceries', name: 'Spożywka', icon: Coffee, color: 'bg-green-100 text-green-700' },
  { id: 'home', name: 'Dom', icon: Home, color: 'bg-blue-100 text-blue-700' },
  { id: 'personal', name: 'Osobiste', icon: Heart, color: 'bg-pink-100 text-pink-700' },
  { id: 'other', name: 'Inne', icon: Package, color: 'bg-gray-100 text-gray-700' }
];

const ShoppingLists = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListType, setNewListType] = useState<'daily' | 'wishlist'>('daily');
  const [newListCategory, setNewListCategory] = useState('groceries');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('zapiszto-shopping-lists');
    if (saved) {
      const parsedLists = JSON.parse(saved);
      setLists(parsedLists);
      if (parsedLists.length > 0) {
        setActiveListId(parsedLists[0].id);
      }
    } else {
      // Create default lists
      const defaultLists: ShoppingList[] = [
        {
          id: 'daily-1',
          name: 'Codzienne zakupy',
          type: 'daily',
          category: 'groceries',
          items: []
        },
        {
          id: 'wishlist-1',
          name: 'Lista marzeń',
          type: 'wishlist',
          category: 'personal',
          items: []
        }
      ];
      setLists(defaultLists);
      setActiveListId(defaultLists[0].id);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('zapiszto-shopping-lists', JSON.stringify(lists));
  }, [lists]);

  const activeList = lists.find(list => list.id === activeListId);

  const addItem = () => {
    if (!newItemName.trim() || !activeListId) return;

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName,
      completed: false,
      price: newItemPrice ? parseFloat(newItemPrice) : undefined,
      category: activeList?.category || 'other'
    };

    setLists(prev => prev.map(list => 
      list.id === activeListId 
        ? { ...list, items: [...list.items, newItem] }
        : list
    ));

    setNewItemName('');
    setNewItemPrice('');
  };

  const toggleItem = (itemId: string) => {
    setLists(prev => prev.map(list => 
      list.id === activeListId
        ? {
            ...list,
            items: list.items.map(item =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            )
          }
        : list
    ));
  };

  const deleteItem = (itemId: string) => {
    setLists(prev => prev.map(list => 
      list.id === activeListId
        ? { ...list, items: list.items.filter(item => item.id !== itemId) }
        : list
    ));
  };

  const addList = () => {
    if (!newListName.trim()) return;

    const newList: ShoppingList = {
      id: Date.now().toString(),
      name: newListName,
      type: newListType,
      category: newListCategory,
      items: []
    };

    setLists(prev => [...prev, newList]);
    setActiveListId(newList.id);
    setIsAddingList(false);
    setNewListName('');
  };

  const deleteList = (listId: string) => {
    setLists(prev => prev.filter(list => list.id !== listId));
    if (activeListId === listId) {
      const remainingLists = lists.filter(list => list.id !== listId);
      setActiveListId(remainingLists.length > 0 ? remainingLists[0].id : null);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : Package;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : 'bg-gray-100 text-gray-700';
  };

  const getTotalPrice = (items: ShoppingItem[]) => {
    return items.reduce((total, item) => total + (item.price || 0), 0);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto pb-24 bg-gradient-to-br from-green-50 via-background to-blue-50">
      {/* Header */}
      <div className="mb-6 sm:mb-8 pt-2">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          Listy zakupów
        </h1>
        <p className="text-muted-foreground mb-4">
          Organizuj swoje codzienne zakupy i listę marzeń ✨
        </p>
      </div>

      {/* Lists tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {lists.map(list => {
          const CategoryIcon = getCategoryIcon(list.category);
          const completedItems = list.items.filter(item => item.completed).length;
          
          return (
            <Button
              key={list.id}
              variant={activeListId === list.id ? "default" : "outline"}
              onClick={() => setActiveListId(list.id)}
              className={`flex items-center gap-2 rounded-2xl ${
                activeListId === list.id ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              <CategoryIcon className="h-4 w-4" />
              <span>{list.name}</span>
              {list.type === 'wishlist' && <Star className="h-3 w-3" />}
              {completedItems > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {completedItems}/{list.items.length}
                </Badge>
              )}
              {lists.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteList(list.id);
                  }}
                  className="h-5 w-5 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Button>
          );
        })}
        
        <Button
          variant="outline"
          onClick={() => setIsAddingList(true)}
          className="rounded-2xl border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nowa lista
        </Button>
      </div>

      {/* Add new list form */}
      {isAddingList && (
        <Card className="card-soft mb-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Nowa lista zakupów</h3>
            <div className="space-y-3">
              <Input
                placeholder="Nazwa listy..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="rounded-xl"
              />
              
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Typ</label>
                  <div className="flex gap-2">
                    <Button
                      variant={newListType === 'daily' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNewListType('daily')}
                      className="rounded-xl"
                    >
                      Codzienne
                    </Button>
                    <Button
                      variant={newListType === 'wishlist' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNewListType('wishlist')}
                      className="rounded-xl"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      Wishlist
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Kategoria</label>
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map(category => {
                      const Icon = category.icon;
                      return (
                        <Button
                          key={category.id}
                          variant={newListCategory === category.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewListCategory(category.id)}
                          className="rounded-xl p-2 text-xs"
                        >
                          <Icon className="h-3 w-3 mr-1" />
                          {category.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={addList} className="btn-primary-soft">
                Utwórz listę
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setIsAddingList(false)}
                className="rounded-xl"
              >
                Anuluj
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Active list */}
      {activeList && (
        <div className="space-y-6">
          {/* Add item form */}
          <Card className="card-soft">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Dodaj do listy
              </h3>
              <div className="flex gap-3">
                <Input
                  placeholder="Co chcesz kupić?"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem()}
                  className="flex-1 rounded-xl"
                />
                <Input
                  placeholder="Cena (zł)"
                  type="number"
                  step="0.01"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addItem()}
                  className="w-20 rounded-xl"
                />
                <Button 
                  onClick={addItem}
                  disabled={!newItemName.trim()}
                  className="btn-primary-soft"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* List items */}
          <Card className="card-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                {activeList.name}
                <Badge variant="outline" className={getCategoryColor(activeList.category)}>
                  {categories.find(cat => cat.id === activeList.category)?.name}
                </Badge>
              </h3>
              {activeList.items.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">
                    {getTotalPrice(activeList.items).toFixed(2)} zł
                  </span>
                  {activeList.items.filter(item => item.completed).length > 0 && (
                    <span className="ml-2">
                      ({activeList.items.filter(item => item.completed).length}/{activeList.items.length} ✓)
                    </span>
                  )}
                </div>
              )}
            </div>

            {activeList.items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Lista jest pusta</p>
                <p className="text-sm">Dodaj pierwszą rzecz do kupienia!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeList.items.map(item => (
                  <div 
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      item.completed 
                        ? 'bg-muted/50 border-muted' 
                        : 'bg-background border-border hover:bg-muted/30'
                    }`}
                  >
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(item.id)}
                      className="rounded-md"
                    />
                    <div className="flex-1">
                      <p className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.name}
                      </p>
                      {item.price && (
                        <p className="text-sm text-muted-foreground">
                          {item.price.toFixed(2)} zł
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                      className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Help text */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          💡 Organizuj zakupy w kategorie i śledź wydatki. 
          <br />
          Wishlisty pomogą Ci zaplanować większe wydatki!
        </p>
      </div>
    </div>
  );
};

export default ShoppingLists;