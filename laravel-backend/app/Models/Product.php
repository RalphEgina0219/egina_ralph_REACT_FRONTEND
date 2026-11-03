<?php 
 
namespace App\Models; 
 
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\HasFactory; 
use Illuminate\Database\Eloquent\Model; 
 
class Product extends Model 
{ 
    protected $table = 'products';

    use HasFactory; 
 
    protected $fillable = [ 
        'category_id',
        'name', 
        'description',
        'price', 
        'quantity', 
    ]; 

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_products')->withPivot('quantity');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
} 