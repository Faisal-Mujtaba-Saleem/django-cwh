from django.db import models

# Create your models here.


class BlogPost(models.Model):
    post_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    content = models.TextField(
        verbose_name=("Content"), max_length=1000, default=""
    )
    head1 = models.CharField(
        verbose_name=("Head1"), max_length=100, default=""
    )
    head1_content = models.TextField(
        verbose_name=("Head1 Content"), default=""
    )
    head2 = models.CharField(verbose_name=(
        "Head2"), max_length=100, default="")
    head2_content = models.TextField(
        verbose_name=("Head2 Content"), default=""
    )
    author = models.CharField(
        verbose_name=("Author"), max_length=50, default=""
    )
    publishedAt = models.DateField(
        verbose_name=("Published At"), auto_now_add=True
    )
    updatedAt = models.DateField(verbose_name=("Updated At"), auto_now=True)
    thumbnail = models.ImageField(
        verbose_name=("Thumbnail"), upload_to='blog/images', default=""
    )

    def __str__(self):
        return self.title
